// @ts-ignore - Google Cloud Speech types may not be available
import { SpeechClient } from '@google-cloud/speech';
import { BaseSTTProvider } from '../BaseSTTProvider';
import { TranscriptionResult, STTProviderConfig } from '../types';

export class GoogleCloudProvider extends BaseSTTProvider {
  private client: any;
  private recognizeStream: any = null;
  private restartCounter: number = 0;
  private resultEndTime: number = 0;
  private isFinalEndTime: number = 0;
  private finalRequestEndTime: number = 0;
  private newStream: boolean = true;
  private bridgingOffset: number = 0;
  private lastTranscriptWasFinal: boolean = false;
  private lastAudioInput: Buffer[] = [];
  private streamingLimit: number = 10000; // 10 seconds for demo purposes
  private restartTimeout?: NodeJS.Timeout;

  constructor(config: STTProviderConfig) {
    super(config);
    
    // Initialize Google Cloud Speech client
    const clientConfig: any = {};
    
    if (config.projectId) {
      clientConfig.projectId = config.projectId;
    }
    
    if (config.keyFilename) {
      clientConfig.keyFilename = config.keyFilename;
    }

    this.client = new SpeechClient(clientConfig);
  }

  async startRealtimeTranscription(): Promise<void> {
    try {
      this.clearAudioBuffer();
      this.restartCounter = 0;
      this.resultEndTime = 0;
      this.isFinalEndTime = 0;
      this.finalRequestEndTime = 0;
      this.newStream = true;
      this.bridgingOffset = 0;
      this.lastTranscriptWasFinal = false;
      this.lastAudioInput = [];

      this.startStream();
      
      // Emit connected event
      this.emitConnected({ sessionId: `google-cloud-${Date.now()}` });
    } catch (error) {
      console.error('Failed to start Google Cloud realtime transcription:', error);
      throw error;
    }
  }

  private startStream(): void {
    // Clear current audioInput
    this.clearAudioBuffer();

    const request = {
      config: {
        encoding: this.config.encoding || 'LINEAR16',
        sampleRateHertz: this.config.sampleRate || 16000,
        languageCode: this.config.languageCode || 'en-US',
      },
      interimResults: true,
    };

    // Initiate (Reinitiate) a recognize stream
    this.recognizeStream = this.client
      .streamingRecognize(request)
      .on('error', (err: any) => {
        if (err.code === 11) {
          // Handle exceeded maximum allowed stream duration
          this.restartStream();
        } else {
          console.error('Google Cloud API request error:', err);
          this.emitError(err);
        }
      })
      .on('data', this.speechCallback.bind(this));

    // Restart stream when streamingLimit expires
    this.restartTimeout = setTimeout(() => {
      this.restartStream();
    }, this.streamingLimit);
  }

  private speechCallback(stream: any): void {
    if (!stream.results || !stream.results[0]) {
      return;
    }

    // Convert API result end time from seconds + nanoseconds to milliseconds
    this.resultEndTime =
      stream.results[0].resultEndTime.seconds * 1000 +
      Math.round(stream.results[0].resultEndTime.nanos / 1000000);

    // Calculate correct time based on offset from audio sent twice
    const correctedTime =
      this.resultEndTime - this.bridgingOffset + this.streamingLimit * this.restartCounter;

    if (stream.results[0] && stream.results[0].alternatives[0]) {
      const transcript = stream.results[0].alternatives[0].transcript;
      const confidence = stream.results[0].alternatives[0].confidence || 0.5;

      if (stream.results[0].isFinal) {
        this.addToCurrentTranscript(transcript);
        this.emitFinalTranscript({
          text: transcript,
          confidence,
          finalized: true,
          audioStart: correctedTime - transcript.length * 100, // Rough estimate
          audioEnd: correctedTime,
        });

        this.isFinalEndTime = this.resultEndTime;
        this.lastTranscriptWasFinal = true;
      } else {
        this.emitPartialTranscript({
          text: transcript,
          confidence,
          finalized: false,
        });

        this.lastTranscriptWasFinal = false;
      }
    }
  }

  private restartStream(): void {
    if (this.recognizeStream) {
      this.recognizeStream.end();
      this.recognizeStream.removeListener('data', this.speechCallback);
      this.recognizeStream = null;
    }

    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }

    if (this.resultEndTime > 0) {
      this.finalRequestEndTime = this.isFinalEndTime;
    }
    this.resultEndTime = 0;

    this.lastAudioInput = [];
    this.lastAudioInput = this.getBufferedAudio();

    this.restartCounter++;

    if (!this.lastTranscriptWasFinal) {
      // Handle partial transcript continuation
    }

    console.log(`Google Cloud: ${this.streamingLimit * this.restartCounter}ms - RESTARTING REQUEST`);

    this.newStream = true;
    this.startStream();
  }

  sendAudioData(audioData: Buffer): void {
    if (!this.isConnected || !this.recognizeStream) {
      console.warn('Google Cloud transcriber not connected, buffering audio data');
      this.bufferAudioData(audioData);
      return;
    }

    try {
      if (this.newStream && this.lastAudioInput.length !== 0) {
        // Approximate math to calculate time of chunks
        const chunkTime = this.streamingLimit / this.lastAudioInput.length;
        if (chunkTime !== 0) {
          if (this.bridgingOffset < 0) {
            this.bridgingOffset = 0;
          }
          if (this.bridgingOffset > this.finalRequestEndTime) {
            this.bridgingOffset = this.finalRequestEndTime;
          }
          const chunksFromMS = Math.floor(
            (this.finalRequestEndTime - this.bridgingOffset) / chunkTime
          );
          this.bridgingOffset = Math.floor(
            (this.lastAudioInput.length - chunksFromMS) * chunkTime
          );

          for (let i = chunksFromMS; i < this.lastAudioInput.length; i++) {
            this.recognizeStream.write(this.lastAudioInput[i]);
          }
        }
        this.newStream = false;
      }

      this.bufferAudioData(audioData);

      if (this.recognizeStream) {
        this.recognizeStream.write(audioData);
      }
    } catch (error) {
      console.error('Failed to send audio data to Google Cloud:', error);
      this.emitError(error as Error);
    }
  }

  async stopRealtimeTranscription(): Promise<string> {
    if (this.recognizeStream) {
      try {
        this.recognizeStream.end();
        this.recognizeStream = null;
      } catch (error) {
        console.error('Error closing Google Cloud recognize stream:', error);
      }
    }

    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }

    this.emitDisconnected({ reason: 'Manual stop' });

    const finalTranscript = this.getCurrentTranscript().trim();
    this.clearCurrentTranscript();
    this.clearAudioBuffer();
    
    return finalTranscript;
  }

  async transcribeAudioFile(audioUrl: string): Promise<TranscriptionResult> {
    try {
      // For file transcription, we need to handle the audio URL differently
      // This is a simplified implementation - in production, you'd want to
      // download the file or use Google Cloud Storage
      
      const request = {
        audio: {
          uri: audioUrl, // Assumes the URL is a Google Cloud Storage URI
        },
        config: {
          encoding: this.config.encoding || 'LINEAR16',
          sampleRateHertz: this.config.sampleRate || 16000,
          languageCode: this.config.languageCode || 'en-US',
          enableWordTimeOffsets: true,
          enableWordConfidence: true,
        },
      };

      const [response] = await this.client.recognize(request);
      
      if (!response.results || response.results.length === 0) {
        return {
          text: '',
          confidence: 0,
          words: [],
        };
      }

      const result = response.results[0];
      const alternative = result.alternatives?.[0];

      if (!alternative) {
        return {
          text: '',
          confidence: 0,
          words: [],
        };
      }

      return {
        text: alternative.transcript || '',
        confidence: alternative.confidence || 0,
        words: alternative.words?.map((word: any) => ({
          text: word.word || '',
          start: word.startTime ? 
            (word.startTime.seconds || 0) * 1000 + Math.round((word.startTime.nanos || 0) / 1000000) : 0,
          end: word.endTime ? 
            (word.endTime.seconds || 0) * 1000 + Math.round((word.endTime.nanos || 0) / 1000000) : 0,
          confidence: word.confidence || 0,
        })),
      };
    } catch (error) {
      console.error('Failed to transcribe audio file with Google Cloud:', error);
      throw error;
    }
  }
}
