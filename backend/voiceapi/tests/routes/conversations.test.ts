import request from 'supertest';
import { createApp } from '../../src/app';
import { databaseService } from '../../src/services/database';
import { transcriptionService } from '../../src/services/transcription';
import { Application } from 'express';

// Mock the services
jest.mock('../../src/services/database');
jest.mock('../../src/services/transcription');

const mockDatabaseService = databaseService as jest.Mocked<typeof databaseService>;
const mockTranscriptionService = transcriptionService as jest.Mocked<typeof transcriptionService>;

describe('Conversations Routes', () => {
  let app: Application;
  const authHeaders = {
    'Authorization': 'Bearer test-api-key-long-enough',
    'OTO_USER_ID': 'test-user-id',
  };

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  describe('GET /conversations', () => {
    it('should list conversations successfully', async () => {
      const mockConversations = [
        {
          id: 'conv-1',
          user_id: 'test-user-id',
          title: 'Test conversation',
          status: 'active',
          last_transcript_preview: 'Hello world...',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];

      mockDatabaseService.listConversations.mockResolvedValue(mockConversations as any);

      const response = await request(app)
        .get('/conversations')
        .set(authHeaders)
        .expect(200);

      expect(response.body).toEqual({ conversations: mockConversations });
      expect(mockDatabaseService.listConversations).toHaveBeenCalledWith('test-user-id', {
        status: undefined,
        updatedSince: undefined,
        limit: undefined,
        offset: undefined,
      });
    });

    it('should filter conversations by query parameters', async () => {
      mockDatabaseService.listConversations.mockResolvedValue([]);

      await request(app)
        .get('/conversations?status=archived&limit=10&offset=5')
        .set(authHeaders)
        .expect(200);

      expect(mockDatabaseService.listConversations).toHaveBeenCalledWith('test-user-id', {
        status: 'archived',
        updatedSince: undefined,
        limit: 10,
        offset: 5,
      });
    });

    it('should handle database errors', async () => {
      mockDatabaseService.listConversations.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/conversations')
        .set(authHeaders)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Internal Server Error',
        message: 'Failed to retrieve conversations',
      });
    });
  });

  describe('GET /conversation/:conversation_id/audio_url', () => {
    const mockConversation = {
      id: 'conv-1',
      user_id: 'test-user-id',
      audio_url: 'https://storage.example.com/audio/conv-1.wav',
    };

    it('should get audio URL successfully', async () => {
      mockDatabaseService.getConversation.mockResolvedValue(mockConversation as any);

      const response = await request(app)
        .get('/conversation/550e8400-e29b-41d4-a716-446655440010/audio_url')
        .set(authHeaders)
        .expect(200);

      expect(response.body).toEqual({
        conversation_id: mockConversation.id,
        audio_url: mockConversation.audio_url,
      });
    });

    it('should return 404 for non-existent conversation', async () => {
      mockDatabaseService.getConversation.mockResolvedValue(null);

      const response = await request(app)
        .get('/conversation/550e8400-e29b-41d4-a716-446655440011/audio_url')
        .set(authHeaders)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Conversation not found',
      });
    });

    it('should return 404 when audio URL is not available', async () => {
      mockDatabaseService.getConversation.mockResolvedValue({
        id: 'conv-1',
        audio_url: null,
      } as any);

      const response = await request(app)
        .get('/conversation/550e8400-e29b-41d4-a716-446655440012/audio_url')
        .set(authHeaders)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Audio not available for this conversation',
      });
    });
  });

  describe('GET /conversation/:conversation_id/transcript', () => {
    const mockConversation = {
      id: 'conv-1',
      user_id: 'test-user-id',
      transcript: 'Hello world, this is a test transcript.',
    };

    it('should get transcript in plain format', async () => {
      mockDatabaseService.getConversation.mockResolvedValue(mockConversation as any);

      const response = await request(app)
        .get('/conversation/550e8400-e29b-41d4-a716-446655440013/transcript')
        .set(authHeaders)
        .expect(200);

      expect(response.body).toEqual({
        conversation_id: mockConversation.id,
        format: 'plain',
        transcript: mockConversation.transcript,
      });
    });

    it('should get transcript in SRT format', async () => {
      mockDatabaseService.getConversation.mockResolvedValue(mockConversation as any);
      mockTranscriptionService.convertToSRT.mockReturnValue('1\n00:00:00,000 --> 00:00:05,000\nHello world\n\n');

      const response = await request(app)
        .get('/conversation/550e8400-e29b-41d4-a716-446655440014/transcript?format=srt')
        .set(authHeaders)
        .expect(200);

      expect(response.body.format).toBe('srt');
      expect(mockTranscriptionService.convertToSRT).toHaveBeenCalledWith(mockConversation.transcript);
    });

    it('should get transcript in VTT format', async () => {
      mockDatabaseService.getConversation.mockResolvedValue(mockConversation as any);
      mockTranscriptionService.convertToVTT.mockReturnValue('WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nHello world\n\n');

      const response = await request(app)
        .get('/conversation/550e8400-e29b-41d4-a716-446655440015/transcript?format=vtt')
        .set(authHeaders)
        .expect(200);

      expect(response.body.format).toBe('vtt');
      expect(mockTranscriptionService.convertToVTT).toHaveBeenCalledWith(mockConversation.transcript);
    });

    it('should return 404 for non-existent conversation', async () => {
      mockDatabaseService.getConversation.mockResolvedValue(null);

      const response = await request(app)
        .get('/conversation/550e8400-e29b-41d4-a716-446655440016/transcript')
        .set(authHeaders)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Conversation not found',
      });
    });

    it('should return 404 when transcript is not available', async () => {
      mockDatabaseService.getConversation.mockResolvedValue({
        id: 'conv-1',
        transcript: null,
      } as any);

      const response = await request(app)
        .get('/conversation/550e8400-e29b-41d4-a716-446655440017/transcript')
        .set(authHeaders)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Transcript not available for this conversation',
      });
    });

    it('should validate format parameter', async () => {
      const response = await request(app)
        .get('/conversation/550e8400-e29b-41d4-a716-446655440018/transcript?format=invalid')
        .set(authHeaders)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('GET /conversation/:conversation_id/logs', () => {
    const mockConversation = {
      id: 'conv-1',
      user_id: 'test-user-id',
    };

    const mockLogs = [
      {
        id: 'log-1',
        conversation_id: 'conv-1',
        start_time: 0,
        end_time: 5000,
        speaker: 'user',
        summary: 'User greeted',
        transcript_excerpt: 'Hello there',
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    it('should get conversation logs successfully', async () => {
      mockDatabaseService.getConversation.mockResolvedValue(mockConversation as any);
      mockDatabaseService.getConversationLogs.mockResolvedValue(mockLogs as any);

      const response = await request(app)
        .get('/conversation/550e8400-e29b-41d4-a716-446655440019/logs')
        .set(authHeaders)
        .expect(200);

      expect(response.body).toEqual({
        conversation_id: mockConversation.id,
        logs: [
          {
            start: mockLogs[0].start_time,
            end: mockLogs[0].end_time,
            speaker: mockLogs[0].speaker,
            summary: mockLogs[0].summary,
            transcript_excerpt: mockLogs[0].transcript_excerpt,
          },
        ],
      });
    });

    it('should handle pagination parameters', async () => {
      mockDatabaseService.getConversation.mockResolvedValue(mockConversation as any);
      mockDatabaseService.getConversationLogs.mockResolvedValue([]);

      await request(app)
        .get('/conversation/550e8400-e29b-41d4-a716-446655440020/logs?limit=50&offset=10')
        .set(authHeaders)
        .expect(200);

      expect(mockDatabaseService.getConversationLogs).toHaveBeenCalledWith(
        'test-user-id',
        '550e8400-e29b-41d4-a716-446655440020',
        { limit: 50, offset: 10 }
      );
    });

    it('should return 404 for non-existent conversation', async () => {
      mockDatabaseService.getConversation.mockResolvedValue(null);

      const response = await request(app)
        .get('/conversation/550e8400-e29b-41d4-a716-446655440021/logs')
        .set(authHeaders)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Conversation not found',
      });
    });
  });

  describe('Validation', () => {
    it('should validate conversation ID format', async () => {
      const response = await request(app)
        .get('/conversation/invalid-uuid/audio_url')
        .set(authHeaders)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });

    it('should validate query parameters', async () => {
      const response = await request(app)
        .get('/conversations?limit=invalid')
        .set(authHeaders)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('Authentication', () => {
    it('should require authentication for all conversation routes', async () => {
      await request(app).get('/conversations').expect(401);
      await request(app).get('/conversation/conv-1/audio_url').expect(401);
      await request(app).get('/conversation/conv-1/transcript').expect(401);
      await request(app).get('/conversation/conv-1/logs').expect(401);
    });
  });
});
