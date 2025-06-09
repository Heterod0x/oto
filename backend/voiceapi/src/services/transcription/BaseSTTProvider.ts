import { EventEmitter } from 'events';
import { 
  TranscriptionResult, 
  STTProviderConfig, 
  TranscriptEvent,
  ConnectionEvent,
  DisconnectionEvent
} from './types';

export abstract class BaseSTTProvider extends EventEmitter {
  protected config: STTProviderConfig;
  protected isConnected: boolean = false;
  protected audioBuffer: Buffer[] = [];
  protected currentTranscript: string = '';

  constructor(config: STTProviderConfig) {
    super();
    this.config = config;
  }

  // Abstract methods that must be implemented by concrete providers
  abstract startRealtimeTranscription(): Promise<void>;
  abstract stopRealtimeTranscription(): Promise<string>;
  abstract sendAudioData(audioData: Buffer): void;
  abstract transcribeAudioFile(audioUrl: string): Promise<TranscriptionResult>;

  // Common methods that can be shared across providers
  getCurrentTranscript(): string {
    return this.currentTranscript;
  }

  isRealtimeConnected(): boolean {
    return this.isConnected;
  }

  protected addToCurrentTranscript(text: string): void {
    this.currentTranscript += ' ' + text;
  }

  protected clearCurrentTranscript(): void {
    this.currentTranscript = '';
  }

  protected bufferAudioData(audioData: Buffer): void {
    this.audioBuffer.push(audioData);
  }

  protected clearAudioBuffer(): void {
    this.audioBuffer = [];
  }

  protected getBufferedAudio(): Buffer[] {
    return [...this.audioBuffer];
  }

  protected flushAudioBuffer(): Buffer[] {
    const buffered = [...this.audioBuffer];
    this.audioBuffer = [];
    return buffered;
  }

  // Event emission helpers
  protected emitConnected(event: ConnectionEvent): void {
    this.isConnected = true;
    this.emit('connected', event);
  }

  protected emitDisconnected(event: DisconnectionEvent): void {
    this.isConnected = false;
    this.emit('disconnected', event);
  }

  protected emitPartialTranscript(event: TranscriptEvent): void {
    this.emit('partial-transcript', event);
  }

  protected emitFinalTranscript(event: TranscriptEvent): void {
    this.emit('final-transcript', event);
  }

  protected emitError(error: Error): void {
    this.emit('error', error);
  }

  // Utility methods for subtitle conversion
  convertToSRT(transcript: string, words?: Array<{ text: string; start: number; end: number }>): string {
    if (!words || words.length === 0) {
      return `1\n00:00:00,000 --> 00:00:10,000\n${transcript}\n\n`;
    }

    let srt = '';
    let index = 1;
    let currentText = '';
    let startTime = words[0].start;
    let endTime = words[0].end;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      currentText += word.text + ' ';

      // Create subtitle every 10 words or at the end
      if ((i + 1) % 10 === 0 || i === words.length - 1) {
        endTime = word.end;
        
        const startSRT = this.millisecondsToSRTTime(startTime);
        const endSRT = this.millisecondsToSRTTime(endTime);
        
        srt += `${index}\n${startSRT} --> ${endSRT}\n${currentText.trim()}\n\n`;
        
        index++;
        currentText = '';
        if (i < words.length - 1) {
          startTime = words[i + 1].start;
        }
      }
    }

    return srt;
  }

  convertToVTT(transcript: string, words?: Array<{ text: string; start: number; end: number }>): string {
    const srt = this.convertToSRT(transcript, words);
    let vtt = 'WEBVTT\n\n';
    
    // Convert SRT timestamps to VTT format (replace comma with dot)
    vtt += srt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
    
    return vtt;
  }

  protected millisecondsToSRTTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  }
}
