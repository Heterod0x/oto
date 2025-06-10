import { EventEmitter } from 'events';
import { ActionDetectionService } from './actionDetection';
import { DetectedAction } from '../types';

interface TranscriptSegment {
  text: string;
  timestamp: string;
  audioStart: number;
  audioEnd: number;
  addedAt: number; // when this segment was added to the detector
}

interface ActionDetectorOptions {
  detectionInterval?: number; // in milliseconds, default 10 seconds
  maxSegments?: number; // maximum number of segments to keep in memory
  minTextLength?: number; // minimum text length before attempting detection
}

export class ActionDetector extends EventEmitter {
  private segments: TranscriptSegment[] = [];
  private actionDetectionService: ActionDetectionService;
  private detectionTimer: NodeJS.Timeout | null = null;
  private options: Required<ActionDetectorOptions>;
  private sessionStartTime: number;
  private isRunning: boolean = false;

  constructor(
    actionDetectionService: ActionDetectionService,
    options: ActionDetectorOptions = {}
  ) {
    super();
    
    this.actionDetectionService = actionDetectionService;
    this.sessionStartTime = Date.now();
    
    // Set default options
    this.options = {
      detectionInterval: options.detectionInterval || 10000, // 10 seconds
      maxSegments: options.maxSegments || 50, // keep last 50 segments
      minTextLength: options.minTextLength || 20, // minimum 20 characters
    };
  }

  /**
   * Start the periodic action detection
   */
  start(): void {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.scheduleNextDetection();
    this.emit('started');
  }

  /**
   * Stop the periodic action detection
   */
  stop(): void {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    
    if (this.detectionTimer) {
      clearTimeout(this.detectionTimer);
      this.detectionTimer = null;
    }

    this.emit('stopped');
  }

  /**
   * Add a new transcript segment with timestamp
   */
  addTranscript(
    text: string,
    audioStart: number,
    audioEnd: number,
    customTimestamp?: string
  ): void {
    if (!text || text.trim().length === 0) {
      return;
    }

    const timestamp = customTimestamp || this.generateTimestamp(audioStart, audioEnd);
    
    const segment: TranscriptSegment = {
      text: text.trim(),
      timestamp,
      audioStart,
      audioEnd,
      addedAt: Date.now(),
    };

    this.segments.push(segment);

    // Keep only the most recent segments to prevent memory issues
    /*
    if (this.segments.length > this.options.maxSegments) {
      this.segments = this.segments.slice(-this.options.maxSegments);
    }*/

    this.emit('transcript-added', segment);
  }

  /**
   * Get the full accumulated transcript with timestamps
   */
  getFullTranscript(): string {
    return this.segments
      .map(segment => `[${segment.timestamp}] ${segment.text}`)
      .join('\n');
  }

  /**
   * Get the plain text transcript without timestamps
   */
  getPlainTranscript(maxSegments: number = 9_999_999): string {
    return this.segments
      .slice(-maxSegments)
      .map(segment => segment.text)
      .join(' ');
  }

  /**
   * Get recent segments since a specific time
   */
  getRecentSegments(sinceMs: number): TranscriptSegment[] {
    const cutoffTime = Date.now() - sinceMs;
    return this.segments.filter(segment => segment.addedAt >= cutoffTime);
  }

  /**
   * Force action detection on current transcript
   */
  async detectActionsNow(): Promise<DetectedAction[]> {
    console.log("detectActionsNow", this.segments.length);

    const transcript = this.getPlainTranscript(100);
    console.log("transcript", transcript);

    if (transcript.length < this.options.minTextLength) {
      return [];
    }

    try {
      // Get the time range for the entire transcript
      const firstSegment = this.segments[0];
      const lastSegment = this.segments[this.segments.length - 1];
      
      const audioStart = firstSegment?.audioStart || 0;
      const audioEnd = lastSegment?.audioEnd || 0;

      const actions = await this.actionDetectionService.detectActions(
        transcript,
        audioStart,
        audioEnd
      );

      console.log("detected actions", actions);

      this.emit('actions-detected', actions);
      return actions;
    } catch (error) {
      this.emit('detection-error', error);
      return [];
    }
  }

  /**
   * Get statistics about the current session
   */
  getStats(): {
    segmentCount: number;
    totalTextLength: number;
    sessionDuration: number;
    isRunning: boolean;
  } {
    return {
      segmentCount: this.segments.length,
      totalTextLength: this.getPlainTranscript().length,
      sessionDuration: Date.now() - this.sessionStartTime,
      isRunning: this.isRunning,
    };
  }

  /**
   * Clear all accumulated transcript segments
   */
  clear(): void {
    this.segments = [];
    this.emit('cleared');
  }

  /**
   * Schedule the next action detection
   */
  private scheduleNextDetection(): void {
    if (!this.isRunning) {
      return;
    }

    this.detectionTimer = setTimeout(async () => {
      if (!this.isRunning) {
        return;
      }

      try {
        await this.detectActionsNow();
      } catch (error) {
        this.emit('detection-error', error);
      }

      // Schedule the next detection
      this.scheduleNextDetection();
    }, this.options.detectionInterval);
  }

  /**
   * Generate a timestamp string for a transcript segment
   */
  private generateTimestamp(audioStart: number, audioEnd: number): string {
    const startTime = this.sessionStartTime + audioStart;
    const endTime = this.sessionStartTime + audioEnd;
    
    const formatTime = (timestamp: number): string => {
      const date = new Date(timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  }
}
