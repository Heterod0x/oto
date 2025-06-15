import { EventEmitter } from 'events';
import { ActionDetectionService } from './actionDetection';
import { TranscriptionBeautifier, BeautifiedSegment } from './transcriptionBeautifier';
import { DetectedAction } from '../types';

interface OriginalTranscriptSegment {
  text: string;
  timestamp: string;
  audioStart: number;
  audioEnd: number;
  addedAt: number; // when this segment was added to the detector
  finalized: boolean; // whether this segment is finalized from transcription service
}

interface BeautifiedTranscriptSegment {
  beautifiedText: string;
  startTimestamp: string;
  endTimestamp: string;
  audioStart: number;
  audioEnd: number;
  speaker: string;
}

interface ActionDetectorOptions {
  detectionInterval?: number; // in milliseconds, default 10 seconds
  beautificationInterval?: number; // in milliseconds, default 15 seconds
  maxSegments?: number; // maximum number of segments to keep in memory
  minTextLength?: number; // minimum text length before attempting detection
  minSegmentsForBeautification?: number; // minimum segments before beautification
}

export class ActionDetector extends EventEmitter {
  private originalSegments: OriginalTranscriptSegment[] = [];
  private beautifiedSegments: BeautifiedTranscriptSegment[] = [];
  private actionDetectionService: ActionDetectionService;
  private transcriptionBeautifier: TranscriptionBeautifier;
  private detectionTimer: NodeJS.Timeout | null = null;
  private beautificationTimer: NodeJS.Timeout | null = null;
  private options: Required<ActionDetectorOptions>;
  private sessionStartTime: number;
  private isRunning: boolean = false;
  private lastBeautifiedIndex: number = 0; // Track which segments have been beautified
  private detectedActions: DetectedAction[] = [];
  private lastSegmentsCountForDetection: number = 0;

  constructor(
    actionDetectionService: ActionDetectionService,
    options: ActionDetectorOptions = {}
  ) {
    super();
    
    this.actionDetectionService = actionDetectionService;
    this.transcriptionBeautifier = new TranscriptionBeautifier();
    this.sessionStartTime = Date.now();
    
    // Set default options
    this.options = {
      detectionInterval: options.detectionInterval || 10000, // 10 seconds
      beautificationInterval: options.beautificationInterval || 15000, // 15 seconds
      maxSegments: options.maxSegments || 50, // keep last 50 segments
      minTextLength: options.minTextLength || 20, // minimum 20 characters
      minSegmentsForBeautification: options.minSegmentsForBeautification || 3, // minimum 5 segments
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
    customTimestamp?: string,
    finalized: boolean = false
  ): void {
    if (!text || text.trim().length === 0) {
      return;
    }

    const timestamp = customTimestamp || this.generateTimestamp(audioStart, audioEnd);
    
    const segment: OriginalTranscriptSegment = {
      text: text.trim(),
      timestamp,
      audioStart,
      audioEnd,
      addedAt: Date.now(),
      finalized,
    };

    this.originalSegments.push(segment);

    // Keep only the most recent segments to prevent memory issues
    if (this.originalSegments.length > this.options.maxSegments) {
      this.originalSegments = this.originalSegments.slice(-this.options.maxSegments);
      // Adjust lastBeautifiedIndex if segments were removed
      this.lastBeautifiedIndex = Math.max(0, this.lastBeautifiedIndex - (this.originalSegments.length - this.options.maxSegments));
    }

    this.emit('transcript-added', segment);
  }

  /**
   * Get the full accumulated transcript with timestamps (original)
   */
  getFullTranscript(): string {
    return this.originalSegments
      .map(segment => `[${segment.timestamp}] ${segment.text}`)
      .join('\n');
  }

  getFullJsonTranscript(): string {
    return JSON.stringify(this.beautifiedSegments);
  }

  /**
   * Get the full beautified transcript with timestamps
   */
  getFullBeautifiedTranscript(): string {
    return this.beautifiedSegments
      .map(segment => `[${segment.startTimestamp} - ${segment.endTimestamp}] ${segment.beautifiedText}`)
      .join('\n');
  }

  /**
   * Get the plain text transcript without timestamps (original)
   */
  getPlainTranscript(maxSegments: number = 9_999_999): string {
    return this.originalSegments
      .slice(-maxSegments)
      .map(segment => segment.text)
      .join(' ');
  }

  getFullBeautifiedTranscriptWithSeconds(): string {
    return this.beautifiedSegments
      .map(segment => `[${segment.audioStart} - ${segment.audioEnd}] ${segment.beautifiedText}`)
      .join('\n');
  }

  /**
   * Get the plain beautified transcript without timestamps
   */
  getPlainBeautifiedTranscript(maxSegments: number = 9_999_999): string {
    return this.beautifiedSegments
      .slice(-maxSegments)
      .map(segment => segment.beautifiedText)
      .join(' ');
  }

  /**
   * Get recent original segments since a specific time
   */
  getRecentSegments(sinceMs: number): OriginalTranscriptSegment[] {
    const cutoffTime = Date.now() - sinceMs;
    return this.originalSegments.filter(segment => segment.addedAt >= cutoffTime);
  }

  /**
   * Force action detection on current transcript
   */
  async detectActionsNow(): Promise<DetectedAction[]> {
    console.log("detectActionsNow", this.originalSegments.length);

    // Use beautified transcript if available, otherwise use original
    const transcript = this.beautifiedSegments.length > 0 
      ? this.getPlainBeautifiedTranscript(100)
      //: this.getPlainTranscript(100);
      : ""; // only allow beautified transcript for now
    
    if (transcript.length < this.options.minTextLength) {
      console.log("transcript is too short", transcript.length);
      return [];
    }

    if (this.lastSegmentsCountForDetection >= this.beautifiedSegments.length) {
      console.log("not much new segments to detect actions yet");
      return [];
    }

    console.log("transcript to detect actions", transcript);
    this.lastSegmentsCountForDetection = this.beautifiedSegments.length;

    try {
      // Get the time range for the entire transcript
      const firstSegment = this.originalSegments[0];
      const lastSegment = this.originalSegments[this.originalSegments.length - 1];
      
      const audioStart = firstSegment?.audioStart || 0;
      const audioEnd = lastSegment?.audioEnd || 0;

      const actions = await this.actionDetectionService.detectActions(
        transcript,
        audioStart,
        audioEnd,
        this.detectedActions
      );

      this.detectedActions.push(...actions);

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
    originalSegmentCount: number;
    beautifiedSegmentCount: number;
    totalTextLength: number;
    sessionDuration: number;
    isRunning: boolean;
  } {
    return {
      originalSegmentCount: this.originalSegments.length,
      beautifiedSegmentCount: this.beautifiedSegments.length,
      totalTextLength: this.getPlainTranscript().length,
      sessionDuration: Date.now() - this.sessionStartTime,
      isRunning: this.isRunning,
    };
  }

  /**
   * Clear all accumulated transcript segments
   */
  clear(): void {
    this.originalSegments = [];
    this.beautifiedSegments = [];
    this.lastBeautifiedIndex = 0;
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
        await this.beautifyPendingSegments(false);
        await this.detectActionsNow();
      } catch (error) {
        this.emit('detection-error', error);
      }

      // Schedule the next detection
      this.scheduleNextDetection();
    }, this.options.detectionInterval);
  }

  private millisecondsToTimestampFormat(ms: number): string {
    const hours   = Math.floor(ms / 3_600_000);          // 1000*60*60
    const minutes = Math.floor(ms / 60_000) % 60;        // 残り分
    const seconds = Math.floor(ms / 1000) % 60;          // 残り秒

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  }

  /**
   * Beautify pending finalized segments
   */
  private async beautifyPendingSegments(full: boolean): Promise<void> {
    try {
      const finalizedSegments = this.originalSegments.filter(segment => segment.finalized);
      const segmentsToBeautify = finalizedSegments.slice(this.lastBeautifiedIndex);

      if (segmentsToBeautify.length === 0) {
        console.log("No segments to beautify");
        return;
      }

      if (!full && segmentsToBeautify.length < this.options.minSegmentsForBeautification) {
        console.log("Not enough segments to beautify", segmentsToBeautify.length);
        return;
      }

      console.log(`Beautifying ${segmentsToBeautify.length} segments`);

      // Prepare segments for beautification
      const segmentsForBeautification = segmentsToBeautify.map(segment => ({
        text: segment.text,
        startTimestamp: this.millisecondsToTimestampFormat(segment.audioStart),
        endTimestamp: this.millisecondsToTimestampFormat(segment.audioEnd),
      }));

      // Call beautification service
      const beautificationResult = await this.transcriptionBeautifier.beautifyTranscriptBatch(
        segmentsForBeautification
      );

      for (const beautifiedSegment of beautificationResult.segments) {
        const newBeautifiedSegment: BeautifiedTranscriptSegment = {
          beautifiedText: beautifiedSegment.beautifiedText,
          startTimestamp: beautifiedSegment.startTimestamp,
          endTimestamp: beautifiedSegment.endTimestamp,
          audioStart: beautifiedSegment.audioStart,
          audioEnd: beautifiedSegment.audioEnd,
          speaker: beautifiedSegment.speaker,
        };

        this.beautifiedSegments.push(newBeautifiedSegment);
      }

      // Update the last beautified index
      this.lastBeautifiedIndex = finalizedSegments.length;

      this.emit('segments-beautified', {
        originalCount: segmentsToBeautify.length,
        beautifiedCount: beautificationResult.segments.length,
        beautifiedSegments: beautificationResult.segments,
        audioStart: segmentsToBeautify[0].audioStart,
        audioEnd: segmentsToBeautify[segmentsToBeautify.length - 1].audioEnd,
        transcript: beautificationResult.segments.map(segment => segment.beautifiedText).join('\n'),
      });

      console.log(`Beautification completed: ${segmentsToBeautify.length} -> ${beautificationResult.segments.length} segments`);
      console.log("beautifiedSegments", this.beautifiedSegments);

    } catch (error) {
      console.error('Failed to beautify segments:', error);
      this.emit('beautification-error', error);
    }
  }

  /**
   * Force beautification of all pending segments
   */
  async beautifyNow(): Promise<void> {
    if (this.beautificationTimer) {
      clearTimeout(this.beautificationTimer);
      this.beautificationTimer = null;
    }
    await this.beautifyPendingSegments(true);
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
