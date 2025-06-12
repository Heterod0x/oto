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

export interface TranscriptSegment {
  audioStart: number;
  audioEnd: number;
  transcript: string;
  finalized: boolean;
  beautified: boolean;
  id?: string; // Add unique identifier for tracking partial updates
}

export interface TranscriptBeautifyData {
  audioStart: number;
  audioEnd: number;
  transcript: string;
  segments: TranscriptSegment[];
}

export interface WebSocketMessage {
  type: 'transcribe' | 'transcript-beautify' | 'detect-action' | 'error';
  data?: any;
  message?: string;
}

export interface ApiConfig {
  baseUrl: string;
  userId: string;
  authToken: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: string;
  id?: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  user_id?: string;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
