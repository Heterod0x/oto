import { AssemblyAI, RealtimeTranscriber, RealtimeTranscript } from 'assemblyai';
import { config } from '../config';
import { EventEmitter } from 'events';

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

// Remove the custom RealtimeTranscript interface since we'll use the one from AssemblyAI

export class TranscriptionService extends EventEmitter {
  private client: AssemblyAI;
  private realtimeTranscriber?: RealtimeTranscriber;
  private isConnected: boolean = false;
  private audioBuffer: Buffer[] = [];
  private currentTranscript: string = '';

  constructor() {
    super();
    this.client = new AssemblyAI({
      apiKey: config.assemblyai.apiKey,
    });
  }

  async startRealtimeTranscription(): Promise<void> {
    try {
      this.realtimeTranscriber = this.client.realtime.transcriber({
        sampleRate: 16000,
      });

      this.realtimeTranscriber.on('open', ({ sessionId }: { sessionId: string }) => {
        console.log(`Realtime transcription session opened: ${sessionId}`);
        this.isConnected = true;
        this.emit('connected', sessionId);
      });

      this.realtimeTranscriber.on('transcript', (transcript: RealtimeTranscript) => {
        if (transcript.message_type === 'PartialTranscript') {
          this.emit('partial-transcript', {
            text: transcript.text,
            confidence: transcript.confidence,
            finalized: false,
          });
        } else if (transcript.message_type === 'FinalTranscript') {
          this.currentTranscript += ' ' + transcript.text;
          this.emit('final-transcript', {
            text: transcript.text,
            confidence: transcript.confidence,
            finalized: true,
            words: transcript.words,
            audioStart: transcript.audio_start,
            audioEnd: transcript.audio_end,
          });
        }
      });

      this.realtimeTranscriber.on('error', (error: Error) => {
        console.error('Realtime transcription error:', error);
        this.emit('error', error);
      });

      this.realtimeTranscriber.on('close', (code: number, reason: string) => {
        console.log(`Realtime transcription session closed: ${code} ${reason}`);
        this.isConnected = false;
        this.emit('disconnected', { code, reason });
      });

      await this.realtimeTranscriber.connect();
    } catch (error) {
      console.error('Failed to start realtime transcription:', error);
      throw error;
    }
  }

  sendAudioData(audioData: Buffer): void {
    if (!this.isConnected || !this.realtimeTranscriber) {
      console.warn('Transcriber not connected, buffering audio data');
      this.audioBuffer.push(audioData);
      return;
    }

    try {
      // Send buffered audio first
      while (this.audioBuffer.length > 0) {
        const bufferedData = this.audioBuffer.shift();
        if (bufferedData) {
          this.realtimeTranscriber.sendAudio(bufferedData);
        }
      }

      // Send current audio data
      this.realtimeTranscriber.sendAudio(audioData);
    } catch (error) {
      console.error('Failed to send audio data:', error);
      this.emit('error', error);
    }
  }

  async stopRealtimeTranscription(): Promise<string> {
    if (this.realtimeTranscriber && this.isConnected) {
      try {
        await this.realtimeTranscriber.close();
      } catch (error) {
        console.error('Error closing realtime transcriber:', error);
      }
    }

    const finalTranscript = this.currentTranscript.trim();
    this.currentTranscript = '';
    this.audioBuffer = [];
    
    return finalTranscript;
  }

  async transcribeAudioFile(audioUrl: string): Promise<TranscriptionResult> {
    try {
      const transcript = await this.client.transcripts.transcribe({
        audio: audioUrl,
        speaker_labels: true,
        word_boost: ['todo', 'task', 'meeting', 'calendar', 'research', 'remind'],
        boost_param: 'high',
      });

      if (transcript.status === 'error') {
        throw new Error(`Transcription failed: ${transcript.error}`);
      }

      return {
        text: transcript.text || '',
        confidence: transcript.confidence || 0,
        words: transcript.words?.map(word => ({
          text: word.text,
          start: word.start,
          end: word.end,
          confidence: word.confidence,
        })),
      };
    } catch (error) {
      console.error('Failed to transcribe audio file:', error);
      throw error;
    }
  }

  getCurrentTranscript(): string {
    return this.currentTranscript;
  }

  isRealtimeConnected(): boolean {
    return this.isConnected;
  }

  // Convert transcript to different formats
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

  private millisecondsToSRTTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = ms % 1000;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
  }
}

export const transcriptionService = new TranscriptionService();
