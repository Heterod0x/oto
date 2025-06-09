// Test setup file
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock external services for testing
jest.mock('../src/services/database', () => ({
  databaseService: {
    createConversation: jest.fn(),
    getConversation: jest.fn(),
    updateConversation: jest.fn(),
    listConversations: jest.fn(),
    createAction: jest.fn(),
    getAction: jest.fn(),
    updateAction: jest.fn(),
    listActions: jest.fn(),
    createConversationLog: jest.fn(),
    getConversationLogs: jest.fn(),
  },
}));

jest.mock('../src/services/transcription', () => ({
  transcriptionService: {
    startRealtimeTranscription: jest.fn(),
    sendAudioData: jest.fn(),
    stopRealtimeTranscription: jest.fn(),
    transcribeAudioFile: jest.fn(),
    getCurrentTranscript: jest.fn(),
    isRealtimeConnected: jest.fn(),
    convertToSRT: jest.fn(),
    convertToVTT: jest.fn(),
    on: jest.fn(),
    emit: jest.fn(),
  },
}));

jest.mock('../src/services/actionDetection', () => ({
  actionDetectionService: {
    detectActions: jest.fn(),
    generateConversationSummary: jest.fn(),
    generateConversationLogs: jest.fn(),
  },
}));

// Mock WebSocket audio stream handler
jest.mock('../src/websocket/audioStream', () => ({
  audioStreamHandler: {
    handleConnection: jest.fn(),
    getActiveSessionsCount: jest.fn().mockReturnValue(0),
    closeAllSessions: jest.fn(),
  },
}));

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
process.env.ASSEMBLYAI_API_KEY = 'test-key';
process.env.OPENAI_API_KEY = 'test-key';
process.env.OTO_API_KEY_SECRET = 'test-secret';

// Global test timeout
jest.setTimeout(10000);

// Suppress console logs during tests unless explicitly needed
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
