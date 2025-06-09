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

export interface Conversation {
  id: string;
  title?: string;
  status: 'active' | 'archived';
  audio_url?: string;
  last_transcript_preview?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationLog {
  start: number;
  end: number;
  speaker: 'user' | 'assistant';
  summary: string;
  transcript_excerpt: string;
}

export interface DetectedAction {
  type: 'todo' | 'calendar' | 'research';
  id: string;
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
  type: 'transcribe' | 'detect-action' | 'error';
  data?: any;
  message?: string;
}

export interface ApiConfig {
  baseUrl: string;
  userId: string;
  authToken: string;
}
