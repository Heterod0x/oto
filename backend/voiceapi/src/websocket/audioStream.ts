import WebSocket from 'ws';
import { IncomingMessage } from 'http';
import { wsAuthMiddleware } from '../middleware/auth';
import { databaseService } from '../services/database';
import { transcriptionService } from '../services/transcription';
import { actionDetectionService } from '../services/actionDetection';
import { WebSocketMessage, DetectedAction } from '../types';

interface ConversationSession {
  conversationId: string;
  userId: string;
  ws: WebSocket;
  transcriptionService: any;
  fullTranscript: string;
  audioBuffer: Buffer[];
  isCompleted: boolean;
  authenticated: boolean;
}

interface AuthMessage {
  userId: string;
  apiKey: string;
}

export class AudioStreamHandler {
  private sessions: Map<string, ConversationSession> = new Map();

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
        transcriptionService: null,
        fullTranscript: '',
        audioBuffer: [],
        isCompleted: false,
        authenticated: false,
      };

      this.sessions.set(sessionId, session);

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
      session.audioBuffer.push(audioBuffer);

      // Send audio to transcription service
      if (session.transcriptionService) {
        session.transcriptionService.sendAudioData(audioBuffer);
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

      // Stop transcription and get final transcript
      const finalTranscript = await session.transcriptionService?.stopRealtimeTranscription() || session.fullTranscript;

      // Update conversation with final transcript
      await databaseService.updateConversation(session.userId, session.conversationId, {
        transcript: finalTranscript,
        last_transcript_preview: this.generatePreview(finalTranscript),
        status: 'archived',
      });

      // Generate conversation logs
      const logs = await actionDetectionService.generateConversationLogs(finalTranscript);
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

      // Close WebSocket connection
      session.ws.close(1000, 'Conversation completed');
      this.sessions.delete(sessionId);

      console.log(`Audio stream session completed: ${sessionId}`);
    } catch (error) {
      console.error('Failed to complete conversation:', error);
      this.sendError(session.ws, 'Failed to complete conversation');
    }
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

      // Set up transcription event handlers
      transcriptionInstance.on('partial-transcript', (data: any) => {
        console.log('partial-transcript', data);
        this.sendTranscribeResponse(session.ws, data.text, false);
      });

      transcriptionInstance.on('final-transcript', async (data: any) => {
        console.log('final-transcript', data);
        session.fullTranscript += ' ' + data.text;
        this.sendTranscribeResponse(session.ws, data.text, true);

        // Detect actions in the transcript segment
        const actions = await actionDetectionService.detectActions(
          data.text,
          data.audioStart,
          data.audioEnd
        );

        // Save detected actions and send to client
        for (const action of actions) {
          await this.saveAndSendAction(session, action);
        }
      });

      transcriptionInstance.on('error', (error: Error) => {
        console.error('Transcription error:', error);
        this.sendError(session.ws, 'Transcription failed');
      });

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

  private sendTranscribeResponse(ws: WebSocket, transcript: string, finalized: boolean): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'transcribe',
        data: {
          finalized,
          transcript,
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
