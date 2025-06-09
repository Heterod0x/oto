import { WebSocketMessage, DetectedAction } from '../types';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private conversationId: string | null = null;
  private baseUrl: string;
  private authToken: string;
  private userId: string;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor(baseUrl: string, authToken: string, userId: string) {
    this.baseUrl = baseUrl.replace('http', 'ws');
    this.authToken = authToken;
    this.userId = userId;
  }

  async connect(conversationId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `${this.baseUrl}/conversation/${conversationId}/stream`;
        this.ws = new WebSocket(wsUrl);

        this.conversationId = conversationId;

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.sendMessage({
            type: 'auth',
            data: {
              userId: this.userId,
              apiKey: this.authToken
            }
          });
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  onMessage(callback: (message: WebSocketMessage) => void): void {
    if (this.ws) {
      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          callback(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };
    }
  }

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        } 
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          this.sendAudioChunk(event.data);
        }
      };

      this.mediaRecorder.start(100); // Send chunks every 100ms
      console.log('Recording started');
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      console.log('Recording stopped');
      
      // Send completion message
      this.sendMessage({
        type: 'complete'
      });
    }
  }

  private async sendAudioChunk(audioBlob: Blob): Promise<void> {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      this.sendMessage({
        type: 'audio',
        data: base64Audio
      });
    } catch (error) {
      console.error('Failed to send audio chunk:', error);
    }
  }

  private sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  disconnect(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.stopRecording();
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.conversationId = null;
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }
}
