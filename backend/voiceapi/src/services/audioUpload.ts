import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';
import { EventEmitter } from 'events';
import { Readable } from 'stream';

export interface AudioUploadOptions {
  conversationId: string;
  userId: string;
  chunkSize?: number; // Size of each chunk in bytes (default: 1MB)
  maxRetries?: number; // Maximum number of retries for failed uploads
  retryDelay?: number; // Delay between retries in milliseconds
}

export interface UploadProgress {
  uploadedBytes: number;
  totalBytes: number;
  percentage: number;
  chunkIndex: number;
  totalChunks: number;
}

export interface UploadResult {
  success: boolean;
  audioUrl?: string;
  error?: string;
  totalBytes: number;
  uploadDuration: number;
}

export class AudioUploadService extends EventEmitter {
  private supabase: SupabaseClient;
  private uploadSessions: Map<string, AudioUploadSession> = new Map();

  constructor() {
    super();
    this.supabase = createClient(
      config.supabase.url,
      config.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  /**
   * Start a new resumable audio upload session
   */
  async startUpload(options: AudioUploadOptions): Promise<string> {
    const sessionId = `${options.conversationId}-${Date.now()}`;
    const session = new AudioUploadSession(this.supabase, sessionId, options);
    
    this.uploadSessions.set(sessionId, session);

    // Forward events from session to this service
    session.on('progress', (progress: UploadProgress) => {
      this.emit('progress', sessionId, progress);
    });

    session.on('error', (error: Error) => {
      this.emit('error', sessionId, error);
    });

    session.on('completed', (result: UploadResult) => {
      this.emit('completed', sessionId, result);
      this.uploadSessions.delete(sessionId);
    });

    await session.initialize();
    return sessionId;
  }

  /**
   * Add audio data to an existing upload session
   */
  async addAudioData(sessionId: string, audioData: Buffer): Promise<void> {
    const session = this.uploadSessions.get(sessionId);
    if (!session) {
      throw new Error(`Upload session ${sessionId} not found`);
    }

    await session.addAudioData(audioData);
  }

  /**
   * Complete the upload session
   */
  async completeUpload(sessionId: string): Promise<UploadResult> {
    const session = this.uploadSessions.get(sessionId);
    if (!session) {
      throw new Error(`Upload session ${sessionId} not found`);
    }

    const result = await session.complete();
    this.uploadSessions.delete(sessionId);
    return result;
  }

  /**
   * Cancel an upload session
   */
  async cancelUpload(sessionId: string): Promise<void> {
    const session = this.uploadSessions.get(sessionId);
    if (session) {
      await session.cancel();
      this.uploadSessions.delete(sessionId);
    }
  }

  /**
   * Get upload progress for a session
   */
  getUploadProgress(sessionId: string): UploadProgress | null {
    const session = this.uploadSessions.get(sessionId);
    return session ? session.getProgress() : null;
  }

  /**
   * Get active upload sessions count
   */
  getActiveSessionsCount(): number {
    return this.uploadSessions.size;
  }

  /**
   * Clean up all active sessions
   */
  async cleanup(): Promise<void> {
    const promises = Array.from(this.uploadSessions.values()).map(session => 
      session.cancel().catch(console.error)
    );
    await Promise.all(promises);
    this.uploadSessions.clear();
  }
}

class AudioUploadSession extends EventEmitter {
  private supabase: SupabaseClient;
  private sessionId: string;
  private options: AudioUploadOptions;
  private audioBuffer: Buffer[] = [];
  private totalBytes = 0;
  private uploadedBytes = 0;
  private chunkIndex = 0;
  private isCompleted = false;
  private isCancelled = false;
  private startTime: number;
  private uploadId?: string;
  private fileName: string;
  private bucketName = config.supabase.bucketName;

  constructor(supabase: SupabaseClient, sessionId: string, options: AudioUploadOptions) {
    super();
    this.supabase = supabase;
    this.sessionId = sessionId;
    this.options = {
      chunkSize: 1024 * 1024, // 1MB default
      maxRetries: 3,
      retryDelay: 1000,
      ...options,
    };
    this.startTime = Date.now();
    this.fileName = `conversations/${options.conversationId}/audio-${sessionId}.wav`;
  }

  async initialize(): Promise<void> {
    try {
      // Ensure the bucket exists
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === this.bucketName);
      
      if (!bucketExists) {
        await this.supabase.storage.createBucket(this.bucketName, {
          public: false,
          allowedMimeTypes: ['audio/wav', 'audio/mpeg', 'audio/mp4', 'audio/webm'],
          fileSizeLimit: 100 * 1024 * 1024, // 100MB limit
        });
      }

      console.log(`Audio upload session initialized: ${this.sessionId}`);
    } catch (error) {
      console.error('Failed to initialize upload session:', error);
      throw error;
    }
  }

  async addAudioData(audioData: Buffer): Promise<void> {
    if (this.isCompleted || this.isCancelled) {
      return;
    }

    this.audioBuffer.push(audioData);
    this.totalBytes += audioData.length;

    // Check if we have enough data to upload a chunk
    const currentBufferSize = this.audioBuffer.reduce((sum, buf) => sum + buf.length, 0);
    
    if (currentBufferSize >= this.options.chunkSize!) {
      await this.uploadChunk();
    }
  }

  private async uploadChunk(): Promise<void> {
    if (this.audioBuffer.length === 0 || this.isCancelled) {
      return;
    }

    const chunkData = Buffer.concat(this.audioBuffer);
    this.audioBuffer = [];

    try {
      await this.uploadChunkWithRetry(chunkData);
      this.uploadedBytes += chunkData.length;
      this.chunkIndex++;

      this.emitProgress();
    } catch (error) {
      console.error(`Failed to upload chunk ${this.chunkIndex}:`, error);
      this.emit('error', error);
    }
  }

  private async uploadChunkWithRetry(chunkData: Buffer, retryCount = 0): Promise<void> {
    try {
      if (this.chunkIndex === 0) {
        // First chunk - create the file
        const { data, error } = await this.supabase.storage
          .from(this.bucketName)
          .upload(this.fileName, chunkData, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          throw error;
        }
      } else {
        // Subsequent chunks - append to existing file using resumable upload
        // Note: Supabase doesn't have native resumable upload, so we'll use a workaround
        // by downloading existing file, concatenating, and re-uploading
        await this.appendToExistingFile(chunkData);
      }
    } catch (error) {
      if (retryCount < this.options.maxRetries!) {
        console.log(`Retrying chunk upload (attempt ${retryCount + 1}/${this.options.maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, this.options.retryDelay!));
        return this.uploadChunkWithRetry(chunkData, retryCount + 1);
      }
      throw error;
    }
  }

  private async appendToExistingFile(newData: Buffer): Promise<void> {
    try {
      // Download existing file
      const { data: existingData, error: downloadError } = await this.supabase.storage
        .from(this.bucketName)
        .download(this.fileName);

      if (downloadError) {
        throw downloadError;
      }

      // Convert blob to buffer and concatenate with new data
      const existingBuffer = Buffer.from(await existingData.arrayBuffer());
      const combinedBuffer = Buffer.concat([existingBuffer, newData]);

      // Upload the combined file
      const { error: uploadError } = await this.supabase.storage
        .from(this.bucketName)
        .update(this.fileName, combinedBuffer, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }
    } catch (error) {
      console.error('Failed to append to existing file:', error);
      throw error;
    }
  }

  async complete(): Promise<UploadResult> {
    if (this.isCompleted) {
      throw new Error('Upload session already completed');
    }

    try {
      // Upload any remaining data
      if (this.audioBuffer.length > 0) {
        await this.uploadChunk();
      }

      this.isCompleted = true;
      const uploadDuration = Date.now() - this.startTime;

      // Get the public URL for the uploaded file
      const { data: urlData } = this.supabase.storage
        .from(this.bucketName)
        .getPublicUrl(this.fileName);

      const result: UploadResult = {
        success: true,
        audioUrl: urlData.publicUrl,
        totalBytes: this.totalBytes,
        uploadDuration,
      };

      this.emit('completed', result);
      return result;
    } catch (error) {
      const result: UploadResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        totalBytes: this.totalBytes,
        uploadDuration: Date.now() - this.startTime,
      };

      this.emit('completed', result);
      return result;
    }
  }

  async cancel(): Promise<void> {
    this.isCancelled = true;
    this.audioBuffer = [];

    try {
      // Clean up partial upload if it exists
      if (this.chunkIndex > 0) {
        await this.supabase.storage
          .from(this.bucketName)
          .remove([this.fileName]);
      }
    } catch (error) {
      console.error('Failed to clean up cancelled upload:', error);
    }

    console.log(`Audio upload session cancelled: ${this.sessionId}`);
  }

  getProgress(): UploadProgress {
    const currentBufferSize = this.audioBuffer.reduce((sum, buf) => sum + buf.length, 0);
    const totalProcessedBytes = this.uploadedBytes + currentBufferSize;
    
    return {
      uploadedBytes: this.uploadedBytes,
      totalBytes: this.totalBytes,
      percentage: this.totalBytes > 0 ? (this.uploadedBytes / this.totalBytes) * 100 : 0,
      chunkIndex: this.chunkIndex,
      totalChunks: Math.ceil(this.totalBytes / this.options.chunkSize!),
    };
  }

  private emitProgress(): void {
    this.emit('progress', this.getProgress());
  }
}

export const audioUploadService = new AudioUploadService();
