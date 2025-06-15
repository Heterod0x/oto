export interface TranscriptionResult {
  text: string;
  confidence: number;
  words?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
  }>;
}

export interface PartialTranscriptEvent {
  text: string;
  confidence: number;
  finalized: false;
}

export interface FinalTranscriptEvent {
  text: string;
  confidence: number;
  finalized: true;
  words?: Array<{
    text: string;
    start: number;
    end: number;
    confidence: number;
  }>;
  audioStart?: number;
  audioEnd?: number;
}

export type TranscriptEvent = PartialTranscriptEvent | FinalTranscriptEvent;

export interface STTProviderConfig {
  apiKey?: string;
  projectId?: string;
  keyFilename?: string;
  sampleRate?: number;
  languageCode?: string;
  encoding?: string;
  [key: string]: any;
}

export enum STTProvider {
  ASSEMBLYAI = 'assemblyai',
  GOOGLE_CLOUD = 'google-cloud'
}

export interface ConnectionEvent {
  sessionId?: string;
  [key: string]: any;
}

export interface DisconnectionEvent {
  code?: number;
  reason?: string;
  [key: string]: any;
}
