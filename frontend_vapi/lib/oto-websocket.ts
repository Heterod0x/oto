import { TranscriptBeautifyData, TranscriptSegment } from "./transcript";

export interface WebSocketMessage {
  type: "transcribe" | "transcript-beautify" | "detect-action" | "error";
  data?: any;
  message?: string;
}

export const handleOtoWsTranscribe = (message: WebSocketMessage) => {
  const segment: TranscriptSegment = {
    audioStart: message.data.audioStart || 0,
    audioEnd: message.data.audioEnd || 0,
    transcript: message.data.transcript,
    finalized: message.data.finalized,
    beautified: false,
    id: message.data.finalized
      ? `${message.data.audioStart || 0}-${message.data.audioEnd || 0}`
      : "partial-current", // Use simple ID for partial transcripts
  };

  return segment;
};

export const handleOtoWsTranscriptBeautify = (message: WebSocketMessage) => {
  const beautifyData: TranscriptBeautifyData = {
    audioStart: message.data.audioStart,
    audioEnd: message.data.audioEnd,
    transcript: message.data.transcript,
    segments: message.data.segments,
  };

  return beautifyData;
};
