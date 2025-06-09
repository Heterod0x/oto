import { WebSocket } from 'ws';
import { TestConfig, WebSocketMessage, WebSocketResponse, TranscribeResponse, DetectActionResponse, Action } from '../types';
import { Logger } from '../utils/logger';
import { AudioGenerator } from '../utils/audio-generator';
import { DEFAULT_CONFIG } from '../config';

export class WebSocketClient {
  private detectedActions: Action[] = [];
  private finalTranscript: string = '';

  constructor(private config: TestConfig) {}

  async simulateAudioStreaming(conversationId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `${this.config.wsUrl}/conversation/${conversationId}/stream`;
      Logger.log(`🔌 Connecting to WebSocket: ${wsUrl}`);

      const ws = new WebSocket(wsUrl, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'oto-user-id': this.config.userId,
        },
      });

      ws.on('open', () => {
        Logger.success('WebSocket connection established');
        this.startAudioStreaming(ws);
      });

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleWebSocketMessage(message);
        } catch (error) {
          Logger.error('Failed to parse WebSocket message:', error);
        }
      });

      ws.on('close', (code, reason) => {
        Logger.log(`🔌 WebSocket closed: ${code} - ${reason}`);
        resolve();
      });

      ws.on('error', (error) => {
        Logger.error('WebSocket error:', error);
        reject(error);
      });
    });
  }

  private startAudioStreaming(ws: WebSocket): void {
    const audioChunks = AudioGenerator.generateMockAudioData();
    let chunkIndex = 0;

    const streamInterval = setInterval(() => {
      if (chunkIndex >= audioChunks.length) {
        this.sendCompletionMessage(ws);
        clearInterval(streamInterval);
        
        // Close connection after a short delay
        setTimeout(() => {
          ws.close();
        }, 1000);
        return;
      }

      this.sendAudioChunk(ws, audioChunks[chunkIndex], chunkIndex, audioChunks.length);
      chunkIndex++;
    }, DEFAULT_CONFIG.CHUNK_INTERVAL_MS);
  }

  private sendAudioChunk(ws: WebSocket, chunk: Buffer, index: number, total: number): void {
    const audioMessage: WebSocketMessage = {
      type: 'audio',
      data: chunk.toString('base64')
    };
    
    ws.send(JSON.stringify(audioMessage));
    Logger.log(`📤 Sent audio chunk ${index + 1}/${total}`);
  }

  private sendCompletionMessage(ws: WebSocket): void {
    const completeMessage: WebSocketMessage = {
      type: 'complete'
    };
    ws.send(JSON.stringify(completeMessage));
    Logger.log('📤 Sent completion message');
  }

  private handleWebSocketMessage(message: WebSocketResponse): void {
    switch (message.type) {
      case 'transcribe':
        this.handleTranscriptionUpdate(message);
        break;

      case 'detect-action':
        this.handleActionDetection(message);
        break;

      default:
        Logger.log('❓ Unknown message type:', message);
    }
  }

  private handleTranscriptionUpdate(message: TranscribeResponse): void {
    Logger.log('📝 Received transcription update:', {
      finalized: message.data.finalized,
      transcript: message.data.transcript
    });
    
    if (message.data.finalized) {
      this.finalTranscript = message.data.transcript;
    }
  }

  private handleActionDetection(message: DetectActionResponse): void {
    Logger.log('🎯 Detected action:', message.data);
    this.detectedActions.push(message.data);
  }

  getDetectedActions(): Action[] {
    return [...this.detectedActions];
  }

  getFinalTranscript(): string {
    return this.finalTranscript;
  }

  reset(): void {
    this.detectedActions = [];
    this.finalTranscript = '';
  }
}
