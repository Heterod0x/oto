export interface Action {
  id: string;
  conversation_id: string;
  user_id: string;
  type: 'todo' | 'calendar' | 'research';
  status: 'created' | 'accepted' | 'deleted' | 'completed';
  title: string;
  body?: string;
  query?: string; // for research actions
  datetime?: string; // ISO string for calendar actions
  transcript_start?: number; // milliseconds
  transcript_end?: number; // milliseconds
  transcript_excerpt?: string;
  created_at: string;
  updated_at: string;
}

export interface ActionInner {
  title: string;
  body?: string;
  query?: string;
  datetime?: string;
}

export interface ActionRelate {
  start: number;
  end: number;
  transcript: string;
}

export interface DetectedAction {
  type: 'todo' | 'calendar' | 'research';
  id: string;
  inner: ActionInner;
  relate: ActionRelate;
}

export interface Conversation {
  id: string;
  user_id: string;
  title?: string;
  status: 'active' | 'archived';
  audio_url?: string;
  transcript?: string;
  last_transcript_preview?: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationLog {
  id: string;
  conversation_id: string;
  start_time: number;
  end_time: number;
  speaker: 'user' | 'assistant';
  summary: string;
  transcript_excerpt?: string;
  created_at: string;
}

export interface WebSocketMessage {
  type: 'auth' | 'audio' | 'complete';
  data?: any; // encoded audio for 'audio' type
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
  data: DetectedAction;
}

export type WebSocketResponse = TranscribeResponse | DetectActionResponse;

export interface ListActionsQuery {
  conversation_id?: string;
  status?: string;
  type?: string;
}

export interface ListConversationsQuery {
  status?: 'active' | 'archived';
  updated_since?: string;
  limit?: number;
  offset?: number;
}

export interface UpdateActionRequest {
  status: 'created' | 'accepted' | 'deleted' | 'completed';
}

export interface AuthHeaders {
  authorization: string;
  oto_user_id: string;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}

export interface TranscriptFormat {
  format: 'plain' | 'srt' | 'vtt';
}

export interface ConversationLogsQuery {
  limit?: number;
  offset?: number;
}
