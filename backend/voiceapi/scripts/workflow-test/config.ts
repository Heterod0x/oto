import { TestConfig } from './types';

export function createTestConfig(): TestConfig {
  const serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
  const wsUrl = serverUrl.replace('http', 'ws');
  const apiKey = process.env.API_KEY || 'test-api-key';
  const userId = process.env.USER_ID || 'test-user-123';

  return {
    serverUrl,
    wsUrl,
    apiKey,
    userId,
  };
}

export const DEFAULT_CONFIG = {
  CHUNK_SIZE: 1024,
  TOTAL_CHUNKS: 50,
  CHUNK_INTERVAL_MS: 100,
  PROCESSING_DELAY_MS: 2000,
  ACTION_UPDATE_DELAY_MS: 500,
  AUDIO_FREQUENCY: 440, // A note
  SAMPLE_RATE: 44100,
} as const;
