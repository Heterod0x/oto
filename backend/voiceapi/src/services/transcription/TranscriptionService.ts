import { EventEmitter } from 'events';
import { config } from '../../config';
import { BaseSTTProvider } from './BaseSTTProvider';
import { ProviderFactory } from './ProviderFactory';
import { STTProvider, STTProviderConfig, TranscriptionResult } from './types';

export class TranscriptionService extends EventEmitter {
  private provider: BaseSTTProvider;
  private currentProvider: STTProvider;

  constructor(providerType?: STTProvider) {
    super();
    
    // Determine which provider to use
    this.currentProvider = providerType || this.getProviderFromConfig();
    
    // Create provider configuration
    const providerConfig = this.getProviderConfig(this.currentProvider);
    
    // Validate configuration
    ProviderFactory.validateProviderConfig(this.currentProvider, providerConfig);
    
    // Create the provider instance
    this.provider = ProviderFactory.createProvider(this.currentProvider, providerConfig);
    
    // Forward events from the provider
    this.setupEventForwarding();
  }

  private getProviderFromConfig(): STTProvider {
    const providerName = config.stt.provider.toLowerCase();
    
    switch (providerName) {
      case 'assemblyai':
        return STTProvider.ASSEMBLYAI;
      case 'google-cloud':
        return STTProvider.GOOGLE_CLOUD;
      default:
        console.warn(`Unknown STT provider '${providerName}', defaulting to AssemblyAI`);
        return STTProvider.ASSEMBLYAI;
    }
  }

  private getProviderConfig(provider: STTProvider): STTProviderConfig {
    switch (provider) {
      case STTProvider.ASSEMBLYAI:
        return {
          apiKey: config.stt.assemblyai.apiKey,
          sampleRate: 16000,
        };
      
      case STTProvider.GOOGLE_CLOUD:
        return {
          projectId: config.stt.googleCloud.projectId,
          keyFilename: config.stt.googleCloud.keyFilename,
          sampleRate: 16000,
          languageCode: 'en-US',
          encoding: 'LINEAR16',
        };
      
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private setupEventForwarding(): void {
    // Forward all events from the provider to this service
    this.provider.on('connected', (event) => {
      console.log(`${this.currentProvider} transcription service connected`);
      this.emit('connected', event);
    });

    this.provider.on('disconnected', (event) => {
      console.log(`${this.currentProvider} transcription service disconnected`);
      this.emit('disconnected', event);
    });

    this.provider.on('partial-transcript', (event) => {
      this.emit('partial-transcript', event);
    });

    this.provider.on('final-transcript', (event) => {
      this.emit('final-transcript', event);
    });

    this.provider.on('error', (error) => {
      console.error(`${this.currentProvider} transcription error:`, error);
      this.emit('error', error);
    });
  }

  // Public API methods that delegate to the provider
  async startRealtimeTranscription(): Promise<void> {
    return this.provider.startRealtimeTranscription();
  }

  sendAudioData(audioData: Buffer): void {
    this.provider.sendAudioData(audioData);
  }

  async stopRealtimeTranscription(): Promise<string> {
    return this.provider.stopRealtimeTranscription();
  }

  async transcribeAudioFile(audioUrl: string): Promise<TranscriptionResult> {
    return this.provider.transcribeAudioFile(audioUrl);
  }

  getCurrentTranscript(): string {
    return this.provider.getCurrentTranscript();
  }

  isRealtimeConnected(): boolean {
    return this.provider.isRealtimeConnected();
  }

  // Utility methods for subtitle conversion
  convertToSRT(transcript: string, words?: Array<{ text: string; start: number; end: number }>): string {
    return this.provider.convertToSRT(transcript, words);
  }

  convertToVTT(transcript: string, words?: Array<{ text: string; start: number; end: number }>): string {
    return this.provider.convertToVTT(transcript, words);
  }

  // Provider management methods
  getCurrentProvider(): STTProvider {
    return this.currentProvider;
  }

  getAvailableProviders(): STTProvider[] {
    return ProviderFactory.getAvailableProviders();
  }

  async switchProvider(newProvider: STTProvider): Promise<void> {
    // Stop current provider if it's running
    if (this.provider.isRealtimeConnected()) {
      await this.provider.stopRealtimeTranscription();
    }

    // Remove old event listeners
    this.provider.removeAllListeners();

    // Create new provider
    const providerConfig = this.getProviderConfig(newProvider);
    ProviderFactory.validateProviderConfig(newProvider, providerConfig);
    
    this.provider = ProviderFactory.createProvider(newProvider, providerConfig);
    this.currentProvider = newProvider;

    // Setup event forwarding for new provider
    this.setupEventForwarding();

    console.log(`Switched to ${newProvider} STT provider`);
  }
}

// Export a singleton instance
export const transcriptionService = new TranscriptionService();
