import { AssemblyAI, RealtimeTranscriber, RealtimeTranscript } from 'assemblyai';
import { BaseSTTProvider } from '../BaseSTTProvider';
import { TranscriptionResult, STTProviderConfig } from '../types';

export class AssemblyAIProvider extends BaseSTTProvider {
  private client: AssemblyAI;
  private realtimeTranscriber?: RealtimeTranscriber;

  constructor(config: STTProviderConfig) {
    super(config);
    
    if (!config.apiKey) {
      throw new Error('AssemblyAI API key is required');
    }

    this.client = new AssemblyAI({
      apiKey: config.apiKey,
    });
  }

  async startRealtimeTranscription(): Promise<void> {
    try {
      this.realtimeTranscriber = this.client.realtime.transcriber({
        sampleRate: this.config.sampleRate || 16000,
      });

      this.realtimeTranscriber.on('open', ({ sessionId }: { sessionId: string }) => {
        console.log(`AssemblyAI realtime transcription session opened: ${sessionId}`);
        this.emitConnected({ sessionId });
      });

      this.realtimeTranscriber.on('transcript', (transcript: RealtimeTranscript) => {
        if (transcript.message_type === 'PartialTranscript') {
          this.emitPartialTranscript({
            text: transcript.text,
            confidence: transcript.confidence,
            finalized: false,
          });
        } else if (transcript.message_type === 'FinalTranscript') {
          this.addToCurrentTranscript(transcript.text);
          this.emitFinalTranscript({
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
        console.error('AssemblyAI realtime transcription error:', error);
        this.emitError(error);
      });

      this.realtimeTranscriber.on('close', (code: number, reason: string) => {
        console.log(`AssemblyAI realtime transcription session closed: ${code} ${reason}`);
        this.emitDisconnected({ code, reason });
      });

      await this.realtimeTranscriber.connect();
    } catch (error) {
      console.error('Failed to start AssemblyAI realtime transcription:', error);
      throw error;
    }
  }

  sendAudioData(audioData: Buffer): void {
    if (!this.isConnected || !this.realtimeTranscriber) {
      console.warn('AssemblyAI transcriber not connected, buffering audio data');
      this.bufferAudioData(audioData);
      return;
    }

    try {
      // Send buffered audio first
      const bufferedAudio = this.flushAudioBuffer();
      for (const bufferedData of bufferedAudio) {
        this.realtimeTranscriber.sendAudio(bufferedData);
      }

      // Send current audio data
      this.realtimeTranscriber.sendAudio(audioData);
    } catch (error) {
      console.error('Failed to send audio data to AssemblyAI:', error);
      this.emitError(error as Error);
    }
  }

  async stopRealtimeTranscription(): Promise<string> {
    if (this.realtimeTranscriber && this.isConnected) {
      try {
        await this.realtimeTranscriber.close();
      } catch (error) {
        console.error('Error closing AssemblyAI realtime transcriber:', error);
      }
    }

    const finalTranscript = this.getCurrentTranscript().trim();
    this.clearCurrentTranscript();
    this.clearAudioBuffer();
    
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
        throw new Error(`AssemblyAI transcription failed: ${transcript.error}`);
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
      console.error('Failed to transcribe audio file with AssemblyAI:', error);
      throw error;
    }
  }
}
