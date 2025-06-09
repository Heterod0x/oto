export interface Action {
  id: string;
  conversation_id: string;
  type: 'todo' | 'calendar' | 'research';
  status: 'created' | 'accepted' | 'deleted' | 'completed';
  created_at: string;
  updated_at: string;
  inner: {
    title: string;
    body?: string;
    query?: string;
    datetime?: string;
  };
  relate: {
    start: number;
    end: number;
    transcript: string;
  };
}

export interface WebSocketMessage {
  type: 'auth' | 'audio' | 'complete';
  data?: string;
}

export interface TranscribeResponse {
  type: 'transcribe';
  data: {
    finalized: boolean;
    transcript: string;
  };
}

export interface DetectActionResponse {
  type: 'detect-action';
  data: Action;
}

export type WebSocketResponse = TranscribeResponse | DetectActionResponse;

export interface TestConfig {
  serverUrl: string;
  wsUrl: string;
  apiKey: string;
  userId: string;
}

export interface TestResults {
  conversationId: string;
  actionsDetected: number;
  finalTranscriptLength: number;
  success: boolean;
  error?: string;
}
