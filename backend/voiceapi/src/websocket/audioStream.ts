import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { wsAuthMiddleware } from '../middleware/auth';
import { databaseService } from '../services/database';
import { TranscriptionService, transcriptionService } from '../services/transcription';
import { actionDetectionService } from '../services/actionDetection';
import { ActionDetector } from '../services/actionDetector';
import { WebSocketMessage, DetectedAction } from '../types';
import { AudioDecoder } from '../services/audioDecoder';
import { BeautifiedSegment } from '@/services/transcriptionBeautifier';

interface ConversationSession {
  conversationId: string;
  userId: string;
  ws: WebSocket;
  transcriptionService?: TranscriptionService;
  actionDetector?: ActionDetector;
  fullTranscript: string;
  isCompleted: boolean;
  authenticated: boolean;
}

interface AuthMessage {
  userId: string;
  apiKey: string;
}

interface BeautifiedSegmentResponse {
  audioStart: number;
  audioEnd: number;
  transcript: string;
}

export class AudioStreamHandler {
  private sessions: Map<string, ConversationSession> = new Map();
  private decoders: Map<string, AudioDecoder> = new Map();

  async handleConnection(ws: WebSocket, req: IncomingMessage): Promise<void> {
    try {
      // Extract conversation ID from URL path
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const pathParts = url.pathname.split('/');
      const conversationId = pathParts[2]; // /conversation/{id}/stream

      if (!conversationId) {
        ws.close(1008, 'Invalid conversation ID');
        return;
      }

      // Authenticate the connection
      // we use the data from the request to authenticate the connection instead of the headers
      /*
      const auth = wsAuthMiddleware(req.headers);
      if (!auth) {
        ws.close(1008, 'Authentication failed');
        return;
      }

      // Verify conversation exists and belongs to user
      const conversation = await databaseService.getConversation(auth.userId, conversationId);
      if (!conversation) {
        ws.close(1008, 'Conversation not found');
        return;
      }*/

      // Create session
      const sessionId = `${conversationId}-${Date.now()}`;
      const session: ConversationSession = {
        conversationId,
        userId: "",
        ws,
        fullTranscript: '',
        isCompleted: false,
        authenticated: false,
      };
      const decoder = new AudioDecoder(false);

      this.sessions.set(sessionId, session);
      this.decoders.set(sessionId, decoder);

      decoder.on("pcm", (pcm: Buffer) => {
        // Send audio to transcription service
        if (session.transcriptionService) {
          session.transcriptionService.sendAudioData(pcm);
        }
      });

      // Set up WebSocket event handlers
      ws.on('message', (data: Buffer) => {
        this.handleMessage(sessionId, data);
      });

      ws.on('close', () => {
        this.handleDisconnection(sessionId);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.handleDisconnection(sessionId);
      });
    } catch (error) {
      console.error('Failed to handle WebSocket connection:', error);
      ws.close(1011, 'Internal server error');
    }
  }

  private async handleMessage(sessionId: string, data: Buffer): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || session.isCompleted) {
      return;
    }

    try {
      const message: WebSocketMessage = JSON.parse(data.toString());

      if (!session.authenticated && message.type !== 'auth') {
        this.sendError(session.ws, 'Authentication required');
        return;
      }

      switch (message.type) {
        case 'auth':
          await this.handleAuth(sessionId, message.data);
          break;

        case 'audio':
          await this.handleAudioData(sessionId, message.data);
          break;
        
        case 'complete':
          await this.handleCompletion(sessionId);
          break;
        
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to handle WebSocket message:', error);
      this.sendError(session.ws, 'Failed to process message');
    }
  }

  private async handleAuth(sessionId: string, data: AuthMessage): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }
    if (session.authenticated) {
      return;
    }

    if (!data) {
      this.sendError(session.ws, 'Authentication failed: No data');
      return;
    }

    if (data.apiKey !== "Bearer " + process.env.OTO_API_KEY_SECRET) {
      this.sendError(session.ws, 'Authentication failed: Invalid API key');
      return;
    }

    if (!data.userId) {
      this.sendError(session.ws, 'Authentication failed: No user ID');
      return;
    }

    session.userId = data.userId;
    session.authenticated = true;

    this.sendAuthResponse(session.ws, session.userId);

    // Start transcription service
    await this.startTranscription(sessionId);
    console.log(`Audio stream session started: ${sessionId}`);
  }

  private async handleAudioData(sessionId: string, encodedAudio?: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || !encodedAudio) {
      return;
    }

    try {
      // Decode base64 audio data
      const audioBuffer = Buffer.from(encodedAudio, 'base64');
      const decoder = this.decoders.get(sessionId);
      if (decoder) {
        decoder.write(audioBuffer);
      }
    } catch (error) {
      console.error('Failed to handle audio data:', error);
      this.sendError(session.ws, 'Failed to process audio data');
    }
  }

  private async handleCompletion(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session || session.isCompleted) {
      return;
    }

    try {
      session.isCompleted = true;

      // Stop action detector and perform final detection
      if (session.actionDetector) {
        session.actionDetector.stop();
        
        // Perform final action detection on any remaining transcript
        await session.actionDetector.beautifyNow();
        const finalActions = await session.actionDetector.detectActionsNow();
        for (const action of finalActions) {
          await this.saveAndSendAction(session, action);
        }
      }

      // Stop transcription and get final transcript
      const finalTranscript = await session.transcriptionService?.stopRealtimeTranscription() || session.fullTranscript;
      
      // Get the full transcript with timestamps from ActionDetector if available
      const timestampedTranscript = session.actionDetector?.getFullTranscript() || finalTranscript;
      const plainTranscript = session.actionDetector?.getPlainTranscript() || finalTranscript;
      const audioTimestampedTranscript = session.actionDetector?.getFullBeautifiedTranscriptWithSeconds() || finalTranscript;

      // Update conversation with final transcript
      await databaseService.createConversation(session.userId, session.conversationId, await actionDetectionService.generateConversationTitle(audioTimestampedTranscript));
      await databaseService.updateConversation(session.userId, session.conversationId, {
        transcript: session.actionDetector?.getFullJsonTranscript(), // Use timestamped version for storage
        last_transcript_preview: await actionDetectionService.generateConversationSummary(audioTimestampedTranscript),
        status: 'archived',
      });

      // Generate conversation logs using the plain transcript
      const logs = await actionDetectionService.generateConversationLogs(audioTimestampedTranscript);
      console.log("logs", logs);
      for (const log of logs) {
        await databaseService.createConversationLog(session.userId, {
          conversation_id: session.conversationId,
          start_time: log.start_time,
          end_time: log.end_time,
          speaker: log.speaker,
          summary: log.summary,
          transcript_excerpt: log.transcript_excerpt,
        });
      }

      // Log session statistics
      if (session.actionDetector) {
        const stats = session.actionDetector.getStats();
        console.log(`Session ${sessionId} completed with stats:`, stats);
      }

      // Close WebSocket connection
      console.log(`Audio stream session completed: ${sessionId}`);
    } catch (error) {
      console.error('Failed to complete conversation:', error);
      this.sendError(session.ws, 'Failed to complete conversation');
    }

    session.ws.close(1000, 'Conversation completed');
    this.sessions.delete(sessionId);
  }

  private async startTranscription(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return;
    }

    try {
      // Create new transcription service instance for this session
      const transcriptionInstance = Object.create(transcriptionService);
      session.transcriptionService = transcriptionInstance;

      // Create and configure ActionDetector for this session
      session.actionDetector = new ActionDetector(actionDetectionService, {
        detectionInterval: 10000, // 10 seconds
        maxSegments: 50,
        minTextLength: 30,
      });

      // Set up ActionDetector event handlers
      session.actionDetector.on('actions-detected', async (actions: DetectedAction[]) => {
        if (session.isCompleted) return;
        // Save detected actions and send to client
        for (const action of actions) {
          await this.saveAndSendAction(session, action);
        }
      });

      session.actionDetector.on('detection-error', (error: Error) => {
        console.error('Action detection error:', error);
      });

      session.actionDetector.on('started', () => {
        console.log(`Action detector started for session: ${sessionId}`);
      });

      session.actionDetector.on('segments-beautified', (data: any) => {
        if (session.isCompleted) return;
        const segments: BeautifiedSegment[] = data.beautifiedSegments;
        this.sendBeautifyResponse(session.ws, data.transcript, data.audioStart, data.audioEnd, segments.map(segment => ({
          audioStart: segment.audioStart,
          audioEnd: segment.audioEnd,
          transcript: segment.beautifiedText,
        })));
      });

      // Set up transcription event handlers
      transcriptionInstance.on('partial-transcript', (data: any) => {
        if (session.isCompleted) return;
        this.sendTranscribeResponse(session.ws, data.text, false, data.audioStart, data.audioEnd);
      });

      transcriptionInstance.on('final-transcript', async (data: any) => {
        if (!data.text) return;
        if (session.isCompleted) return;

        console.log("final-transcript", data);
        this.sendTranscribeResponse(session.ws, data.text, true, data.audioStart, data.audioEnd);

        // Add transcript to action detector instead of immediate detection
        if (session.actionDetector) {
          session.actionDetector.addTranscript(
            data.text,
            data.audioStart,
            data.audioEnd,
            undefined, // customTimestamp
            true // finalized
          );
        }

        session.fullTranscript += ' ' + data.text;
      });

      transcriptionInstance.on('error', (error: Error) => {
        console.error('Transcription error:', error);
        this.sendError(session.ws, 'Transcription failed');
      });

      // Start action detector
      session.actionDetector.start();

      // Start real-time transcription
      await transcriptionInstance.startRealtimeTranscription();
    } catch (error) {
      console.error('Failed to start transcription:', error);
      this.sendError(session.ws, 'Failed to start transcription');
    }
  }

  private async saveAndSendAction(session: ConversationSession, detectedAction: DetectedAction): Promise<void> {
    try {
      // Save action to database
      const action = await databaseService.createAction(session.userId, {
        conversation_id: session.conversationId,
        user_id: session.userId,
        type: detectedAction.type,
        status: 'created',
        title: detectedAction.inner.title,
        body: detectedAction.inner.body,
        query: detectedAction.inner.query,
        datetime: detectedAction.inner.datetime,
        transcript_start: detectedAction.relate.start,
        transcript_end: detectedAction.relate.end,
        transcript_excerpt: detectedAction.relate.transcript,
      });

      // Send action detection response to client
      this.sendDetectActionResponse(session.ws, detectedAction);
    } catch (error) {
      console.error('Failed to save detected action:', error);
    }
  }

  private sendTranscribeResponse(ws: WebSocket, transcript: string, finalized: boolean, audioStart: number, audioEnd: number): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'transcribe',
        data: {
          finalized,
          transcript,
          audioStart,
          audioEnd,
        },
      }));
    }
  }

  private sendBeautifyResponse(ws: WebSocket, transcript: string, audioStart: number, audioEnd: number, segments: BeautifiedSegmentResponse[]): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'transcript-beautify',
        data: {
          transcript,
          audioStart,
          audioEnd,
          segments,
        },
      }));
    }
  }

  private sendDetectActionResponse(ws: WebSocket, action: DetectedAction): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'detect-action',
        data: action,
      }));
    }
  }

  private sendError(ws: WebSocket, message: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'error',
        message,
      }));
    }
  }

  private sendAuthResponse(ws: WebSocket, userId: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'auth',
        data: { userId },
      }));
    }
  }

  private handleDisconnection(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      // Clean up transcription service
      if (session.transcriptionService) {
        session.transcriptionService.stopRealtimeTranscription().catch((error: Error) => {
          console.error('Error stopping transcription:', error);
        });
      }

      // Clean up action detector
      if (session.actionDetector) {
        session.actionDetector.stop();
        session.actionDetector.removeAllListeners();
      }

      this.sessions.delete(sessionId);
      console.log(`Audio stream session disconnected: ${sessionId}`);
    }
  }

  private generatePreview(transcript: string): string {
    const words = transcript.trim().split(/\s+/);
    const preview = words.slice(0, 20).join(' ');
    return preview.length < transcript.length ? preview + '...' : preview;
  }

  // Get active sessions count for monitoring
  getActiveSessionsCount(): number {
    return this.sessions.size;
  }

  // Force close all sessions (for graceful shutdown)
  closeAllSessions(): void {
    for (const [sessionId, session] of this.sessions) {
      session.ws.close(1001, 'Server shutting down');
      this.handleDisconnection(sessionId);
    }
  }
}

export const audioStreamHandler = new AudioStreamHandler();
