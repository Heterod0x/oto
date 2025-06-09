import request from 'supertest';
import { createApp } from '../../src/app';
import { databaseService } from '../../src/services/database';
import { Application } from 'express';

// Mock the database service
jest.mock('../../src/services/database');
const mockDatabaseService = databaseService as jest.Mocked<typeof databaseService>;

describe('Actions Routes', () => {
  let app: Application;
  const authHeaders = {
    'Authorization': 'Bearer test-api-key-long-enough',
    'OTO_USER_ID': 'test-user-id',
  };

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  describe('GET /actions', () => {
    it('should list actions successfully', async () => {
      const mockActions = [
        {
          id: 'action-1',
          conversation_id: 'conv-1',
          user_id: 'test-user-id',
          type: 'todo',
          status: 'created',
          title: 'Test action',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ];

      mockDatabaseService.listActions.mockResolvedValue(mockActions as any);

      const response = await request(app)
        .get('/actions')
        .set(authHeaders)
        .expect(200);

      expect(response.body).toEqual({ actions: mockActions });
      expect(mockDatabaseService.listActions).toHaveBeenCalledWith('test-user-id', {
        conversationId: undefined,
        status: undefined,
        type: undefined,
      });
    });

    it('should filter actions by query parameters', async () => {
      mockDatabaseService.listActions.mockResolvedValue([]);

      await request(app)
        .get('/actions?conversation_id=550e8400-e29b-41d4-a716-446655440001&status=completed&type=todo')
        .set(authHeaders)
        .expect(200);

      expect(mockDatabaseService.listActions).toHaveBeenCalledWith('test-user-id', {
        conversationId: '550e8400-e29b-41d4-a716-446655440001',
        status: 'completed',
        type: 'todo',
      });
    });

    it('should handle database errors', async () => {
      mockDatabaseService.listActions.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/actions')
        .set(authHeaders)
        .expect(500);

      expect(response.body).toEqual({
        error: 'Internal Server Error',
        message: 'Failed to retrieve actions',
      });
    });
  });

  describe('GET /action/:action_id', () => {
    const mockAction = {
      id: 'action-1',
      conversation_id: 'conv-1',
      user_id: 'test-user-id',
      type: 'todo',
      status: 'created',
      title: 'Test action',
      body: 'Test body',
      transcript_start: 1000,
      transcript_end: 2000,
      transcript_excerpt: 'Test transcript',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    };

    it('should get action successfully', async () => {
      mockDatabaseService.getAction.mockResolvedValue(mockAction as any);

      const response = await request(app)
        .get('/action/550e8400-e29b-41d4-a716-446655440000')
        .set(authHeaders)
        .expect(200);

      expect(response.body).toEqual({
        type: mockAction.type,
        created_at: mockAction.created_at,
        updated_at: mockAction.updated_at,
        status: mockAction.status,
        id: mockAction.id,
        conversation_id: mockAction.conversation_id,
        inner: {
          title: mockAction.title,
          body: mockAction.body,
        },
        relate: {
          start: mockAction.transcript_start,
          end: mockAction.transcript_end,
          transcript: mockAction.transcript_excerpt,
        },
      });
    });

    it('should return 404 for non-existent action', async () => {
      mockDatabaseService.getAction.mockResolvedValue(null);

      const response = await request(app)
        .get('/action/550e8400-e29b-41d4-a716-446655440002')
        .set(authHeaders)
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Action not found',
      });
    });

    it('should validate action ID format', async () => {
      const response = await request(app)
        .get('/action/invalid-uuid')
        .set(authHeaders)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('PATCH /action/:action_id', () => {
    const mockAction = {
      id: 'action-1',
      status: 'accepted',
      updated_at: '2023-01-01T01:00:00Z',
    };

    it('should update action status successfully', async () => {
      mockDatabaseService.getAction.mockResolvedValue({ id: 'action-1' } as any);
      mockDatabaseService.updateAction.mockResolvedValue(mockAction as any);

      const response = await request(app)
        .patch('/action/550e8400-e29b-41d4-a716-446655440003')
        .set(authHeaders)
        .send({ status: 'accepted' })
        .expect(200);

      expect(response.body).toEqual({
        id: mockAction.id,
        status: mockAction.status,
        updated_at: mockAction.updated_at,
      });

      expect(mockDatabaseService.updateAction).toHaveBeenCalledWith(
        'test-user-id',
        '550e8400-e29b-41d4-a716-446655440003',
        { status: 'accepted' }
      );
    });

    it('should return 404 for non-existent action', async () => {
      mockDatabaseService.getAction.mockResolvedValue(null);

      const response = await request(app)
        .patch('/action/550e8400-e29b-41d4-a716-446655440004')
        .set(authHeaders)
        .send({ status: 'accepted' })
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Action not found',
      });
    });

    it('should validate request body', async () => {
      const response = await request(app)
        .patch('/action/550e8400-e29b-41d4-a716-446655440005')
        .set(authHeaders)
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });

    it('should require status field', async () => {
      const response = await request(app)
        .patch('/action/550e8400-e29b-41d4-a716-446655440006')
        .set(authHeaders)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
    });
  });

  describe('Authentication', () => {
    it('should require authentication for all action routes', async () => {
      await request(app).get('/actions').expect(401);
      await request(app).get('/action/action-1').expect(401);
      await request(app).patch('/action/action-1').expect(401);
    });
  });
});
