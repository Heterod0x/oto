import { Server } from 'http';
import { audioStreamHandler } from '../../src/websocket/audioStream';

// Mock the audio stream handler
jest.mock('../../src/websocket/audioStream');
const mockAudioStreamHandler = audioStreamHandler as jest.Mocked<typeof audioStreamHandler>;

// Create a mock WebSocket Server class
class MockWebSocketServer {
  public on = jest.fn();
  public close = jest.fn((callback) => {
    if (callback) {
      process.nextTick(callback);
    }
  });

  constructor(options: any) {
    // Mock constructor behavior
  }
}

// Mock the ws module
jest.mock('ws', () => ({
  Server: MockWebSocketServer,
}));

// Import after mocking
import { createWebSocketServer, closeWebSocketServer } from '../../src/websocket/server';

describe('WebSocket Server', () => {
  let mockHttpServer: Server;
  let mockWsServer: MockWebSocketServer;

  beforeEach(() => {
    // Mock HTTP server with required methods
    mockHttpServer = {
      on: jest.fn(),
      listen: jest.fn(),
      close: jest.fn(),
    } as any;

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('createWebSocketServer', () => {
    it('should create WebSocket server', () => {
      const wss = createWebSocketServer(mockHttpServer);
      expect(wss).toBeDefined();
      expect(wss.on).toHaveBeenCalledWith('connection', expect.any(Function));
    });

    it('should set up connection handler', () => {
      const wss = createWebSocketServer(mockHttpServer);
      expect(wss.on).toHaveBeenCalledWith('connection', expect.any(Function));
    });
  });

  describe('closeWebSocketServer', () => {
    beforeEach(() => {
      mockWsServer = new MockWebSocketServer({});
    });

    it('should close WebSocket server and all sessions', async () => {
      mockAudioStreamHandler.closeAllSessions.mockImplementation(() => {});

      await closeWebSocketServer(mockWsServer as any);

      expect(mockAudioStreamHandler.closeAllSessions).toHaveBeenCalled();
      expect(mockWsServer.close).toHaveBeenCalled();
    });

    it('should resolve when server is closed', async () => {
      const promise = closeWebSocketServer(mockWsServer as any);
      
      // Should resolve without hanging
      await expect(promise).resolves.toBeUndefined();
    });
  });
});
