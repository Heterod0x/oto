export class AudioFileService {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private mediaStreamDestination: MediaStreamAudioDestinationNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private isPlaying: boolean = false;
  private onAudioChunkCallback: ((audioBlob: Blob) => void) | null = null;
  private startTime: number = 0;
  private pausedAt: number = 0;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async loadAudioFile(file: File): Promise<void> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      this.audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      console.log('Audio file loaded:', {
        duration: this.audioBuffer.duration,
        sampleRate: this.audioBuffer.sampleRate,
        channels: this.audioBuffer.numberOfChannels
      });
    } catch (error) {
      console.error('Failed to load audio file:', error);
      throw new Error('Failed to load audio file. Please ensure it\'s a valid audio format.');
    }
  }

  async startPlayback(onAudioChunk: (audioBlob: Blob) => void): Promise<void> {
    if (!this.audioBuffer || !this.audioContext) {
      throw new Error('No audio file loaded');
    }

    if (this.isPlaying) {
      this.stopPlayback();
    }

    this.onAudioChunkCallback = onAudioChunk;
    this.isPlaying = true;

    // Create source node
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;

    // Create MediaStreamDestination to capture audio as a MediaStream
    this.mediaStreamDestination = this.audioContext.createMediaStreamDestination();

    // Connect source to both the MediaStreamDestination (for recording) and speakers (for playback)
    this.sourceNode.connect(this.mediaStreamDestination);
    this.sourceNode.connect(this.audioContext.destination); // This sends audio to speakers

    // Create MediaRecorder with the same settings as microphone
    this.mediaRecorder = new MediaRecorder(this.mediaStreamDestination.stream, {
      mimeType: 'audio/webm;codecs=opus'
    });

    // Set up MediaRecorder event handlers
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && this.onAudioChunkCallback) {
        this.onAudioChunkCallback(event.data);
      }
    };

    this.mediaRecorder.onstart = () => {
      console.log('MediaRecorder started for file playback');
    };

    this.mediaRecorder.onstop = () => {
      console.log('MediaRecorder stopped for file playback');
    };

    // Handle playback end
    this.sourceNode.onended = () => {
      this.stopPlayback();
    };

    // Start MediaRecorder with same chunk interval as microphone (100ms)
    this.mediaRecorder.start(100);

    // Start audio playback
    this.startTime = this.audioContext.currentTime - this.pausedAt;
    this.sourceNode.start(0, this.pausedAt);
    
    console.log('Audio file playback started with Opus encoding');
  }

  stopPlayback(): void {
    this.isPlaying = false;
    
    // Stop MediaRecorder
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }

    // Stop and disconnect source node
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch (error) {
        // Ignore errors when stopping already stopped nodes
      }
      this.sourceNode = null;
    }

    // Clean up MediaStreamDestination
    if (this.mediaStreamDestination) {
      this.mediaStreamDestination.disconnect();
      this.mediaStreamDestination = null;
    }

    this.pausedAt = 0;
    this.onAudioChunkCallback = null;
    console.log('Audio file playback stopped');
  }

  pausePlayback(): void {
    if (this.isPlaying && this.audioContext) {
      this.pausedAt = this.audioContext.currentTime - this.startTime;
      this.stopPlayback();
    }
  }

  isPlaybackActive(): boolean {
    return this.isPlaying;
  }

  getDuration(): number {
    return this.audioBuffer ? this.audioBuffer.duration : 0;
  }

  getCurrentTime(): number {
    if (!this.audioContext || !this.isPlaying) {
      return this.pausedAt;
    }
    return this.audioContext.currentTime - this.startTime;
  }

  seekTo(time: number): void {
    if (!this.audioBuffer) {
      return;
    }

    // Clamp time to valid range
    const clampedTime = Math.max(0, Math.min(time, this.audioBuffer.duration));
    
    if (this.isPlaying) {
      // If currently playing, stop and restart at new position
      const wasPlaying = true;
      const callback = this.onAudioChunkCallback;
      this.stopPlayback();
      this.pausedAt = clampedTime;
      
      if (wasPlaying && callback) {
        // Restart playback at new position
        this.startPlayback(callback);
      }
    } else {
      // If not playing, just update the paused position
      this.pausedAt = clampedTime;
    }
    
    console.log(`Seeked to ${clampedTime.toFixed(2)}s`);
  }
}
