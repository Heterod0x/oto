import request from 'supertest';
import { createApp } from '../src/app';
import { databaseService } from '../src/services/database';
import { audioStreamHandler } from '../src/websocket/audioStream';
import { Application } from 'express';

// Mock the database service
jest.mock('../src/services/database');
jest.mock('../src/websocket/audioStream');

const mockDatabaseService = databaseService as jest.Mocked<typeof databaseService>;
const mockAudioStreamHandler = audioStreamHandler as jest.Mocked<typeof audioStreamHandler>;

describe('App', () => {
  let app: Application;

  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
    
    // Mock audioStreamHandler methods
    mockAudioStreamHandler.getActiveSessionsCount.mockReturnValue(0);
  });

  describe('Health endpoint', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        status: 'healthy',
        timestamp: expect.any(String),
        version: '1.0.0',
        activeWebSocketSessions: expect.any(Number),
      });
    });
  });

  describe('Root endpoint', () => {
    it('should return API documentation', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toEqual({
        name: 'Oto Voice API',
        version: '1.0.0',
        description: 'Turn spoken words into structured data',
        endpoints: {
          websocket: '/conversation/{id}/stream',
          rest: {
            actions: {
              list: 'GET /actions',
              get: 'GET /action/{id}',
              update: 'PATCH /action/{id}',
            },
            conversations: {
              list: 'GET /conversations',
              audioUrl: 'GET /conversation/{id}/audio_url',
              transcript: 'GET /conversation/{id}/transcript',
              logs: 'GET /conversation/{id}/logs',
            },
          },
          authentication: {
            headers: ['Authorization', 'OTO_USER_ID'],
          },
        },
      });
    });
  });

  describe('Authentication middleware', () => {
    it('should require authentication for protected routes', async () => {
      await request(app)
        .get('/actions')
        .expect(401);

      await request(app)
        .get('/conversations')
        .expect(401);
    });

    it('should accept valid authentication headers', async () => {
      mockDatabaseService.listActions.mockResolvedValue([]);

      const response = await request(app)
        .get('/actions')
        .set('Authorization', 'Bearer test-api-key-long-enough')
        .set('OTO_USER_ID', 'test-user-id')
        .expect(200);

      expect(response.body).toHaveProperty('actions');
    });

    it('should reject requests without Authorization header', async () => {
      const response = await request(app)
        .get('/actions')
        .set('OTO_USER_ID', 'test-user-id')
        .expect(401);

      expect(response.body).toEqual({
        error: 'Unauthorized',
        message: 'Authorization header is required',
      });
    });

    it('should reject requests without OTO_USER_ID header', async () => {
      const response = await request(app)
        .get('/actions')
        .set('Authorization', 'Bearer test-api-key')
        .expect(401);

      expect(response.body).toEqual({
        error: 'Unauthorized',
        message: 'OTO_USER_ID header is required',
      });
    });

    it('should reject requests with invalid API key format', async () => {
      const response = await request(app)
        .get('/actions')
        .set('Authorization', 'Bearer short')
        .set('OTO_USER_ID', 'test-user-id')
        .expect(401);

      expect(response.body).toEqual({
        error: 'Unauthorized',
        message: 'Invalid API key',
      });
    });
  });

  describe('404 handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);

      expect(response.body).toEqual({
        error: 'Not Found',
        message: 'Route GET /non-existent-route not found',
      });
    });
  });

  describe('Security headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });

  describe('CORS', () => {
    it('should handle CORS preflight requests', async () => {
      await request(app)
        .options('/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .expect(204);
    });
  });

  describe('JSON parsing', () => {
    it('should parse JSON request bodies', async () => {
      const testData = { status: 'accepted' };
      
      // Mock the database calls for this test
      mockDatabaseService.getAction.mockResolvedValue({ id: 'test-action' } as any);
      mockDatabaseService.updateAction.mockResolvedValue({ 
        id: 'test-action', 
        status: 'accepted', 
        updated_at: '2023-01-01T00:00:00Z' 
      } as any);
      
      const response = await request(app)
        .patch('/action/550e8400-e29b-41d4-a716-446655440030')
        .set('Authorization', 'Bearer test-api-key-long-enough')
        .set('OTO_USER_ID', 'test-user-id')
        .send(testData);

      // The route should process the JSON successfully
      expect(response.status).toBe(200);
    });

    it('should reject invalid JSON', async () => {
      const response = await request(app)
        .patch('/action/550e8400-e29b-41d4-a716-446655440031')
        .set('Authorization', 'Bearer test-api-key-long-enough')
        .set('OTO_USER_ID', 'test-user-id')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });
  });
});
