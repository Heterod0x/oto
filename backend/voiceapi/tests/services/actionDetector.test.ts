import { ActionDetector } from '../../src/services/actionDetector';
import { ActionDetectionService } from '../../src/services/actionDetection';
import { DetectedAction } from '../../src/types';

// Mock the ActionDetectionService
jest.mock('../../src/services/actionDetection');

describe('ActionDetector', () => {
  let actionDetector: ActionDetector;
  let mockActionDetectionService: jest.Mocked<ActionDetectionService>;

  beforeEach(() => {
    mockActionDetectionService = new ActionDetectionService() as jest.Mocked<ActionDetectionService>;
    actionDetector = new ActionDetector(mockActionDetectionService, {
      detectionInterval: 1000, // 1 second for testing
      maxSegments: 10,
      minTextLength: 10,
    });
  });

  afterEach(() => {
    actionDetector.stop();
    actionDetector.removeAllListeners();
  });

  describe('addTranscript', () => {
    it('should add transcript segments with timestamps', () => {
      actionDetector.addTranscript('Hello world', 0, 1000);
      actionDetector.addTranscript('How are you?', 1000, 2000);

      const fullTranscript = actionDetector.getFullTranscript();
      const plainTranscript = actionDetector.getPlainTranscript();

      expect(fullTranscript).toContain('Hello world');
      expect(fullTranscript).toContain('How are you?');
      expect(fullTranscript).toMatch(/\[\d{2}:\d{2}:\d{2} - \d{2}:\d{2}:\d{2}\]/);
      
      expect(plainTranscript).toBe('Hello world How are you?');
    });

    it('should ignore empty or whitespace-only text', () => {
      actionDetector.addTranscript('', 0, 1000);
      actionDetector.addTranscript('   ', 1000, 2000);
      actionDetector.addTranscript('Valid text', 2000, 3000);

      const stats = actionDetector.getStats();
      expect(stats.segmentCount).toBe(1);
      expect(actionDetector.getPlainTranscript()).toBe('Valid text');
    });

    it('should limit segments to maxSegments', () => {
      // Add more segments than the limit
      for (let i = 0; i < 15; i++) {
        actionDetector.addTranscript(`Segment ${i}`, i * 1000, (i + 1) * 1000);
      }

      const stats = actionDetector.getStats();
      expect(stats.segmentCount).toBe(10); // Should be limited to maxSegments
    });
  });

  describe('start and stop', () => {
    it('should start and stop the detector', () => {
      expect(actionDetector.getStats().isRunning).toBe(false);

      actionDetector.start();
      expect(actionDetector.getStats().isRunning).toBe(true);

      actionDetector.stop();
      expect(actionDetector.getStats().isRunning).toBe(false);
    });

    it('should emit started and stopped events', (done) => {
      let startedEmitted = false;
      let stoppedEmitted = false;

      actionDetector.on('started', () => {
        startedEmitted = true;
      });

      actionDetector.on('stopped', () => {
        stoppedEmitted = true;
        expect(startedEmitted).toBe(true);
        expect(stoppedEmitted).toBe(true);
        done();
      });

      actionDetector.start();
      setTimeout(() => {
        actionDetector.stop();
      }, 100);
    });
  });

  describe('detectActionsNow', () => {
    it('should detect actions when transcript is long enough', async () => {
      const mockActions: DetectedAction[] = [
        {
          type: 'todo',
          id: 'test-id',
          inner: { title: 'Test action' },
          relate: { start: 0, end: 1000, transcript: 'Test transcript' }
        }
      ];

      mockActionDetectionService.detectActions.mockResolvedValue(mockActions);

      actionDetector.addTranscript('This is a long enough transcript for detection', 0, 1000);

      const actions = await actionDetector.detectActionsNow();
      expect(actions).toEqual(mockActions);
      expect(mockActionDetectionService.detectActions).toHaveBeenCalledWith(
        'This is a long enough transcript for detection',
        0,
        1000
      );
    });

    it('should return empty array when transcript is too short', async () => {
      actionDetector.addTranscript('Short', 0, 1000);

      const actions = await actionDetector.detectActionsNow();
      expect(actions).toEqual([]);
      expect(mockActionDetectionService.detectActions).not.toHaveBeenCalled();
    });

    it('should emit actions-detected event', (done) => {
      const mockActions: DetectedAction[] = [
        {
          type: 'todo',
          id: 'test-id',
          inner: { title: 'Test action' },
          relate: { start: 0, end: 1000, transcript: 'Test transcript' }
        }
      ];

      mockActionDetectionService.detectActions.mockResolvedValue(mockActions);

      actionDetector.on('actions-detected', (actions) => {
        expect(actions).toEqual(mockActions);
        done();
      });

      actionDetector.addTranscript('This is a long enough transcript for detection', 0, 1000);
      actionDetector.detectActionsNow();
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      actionDetector.addTranscript('Hello world', 0, 1000);
      actionDetector.addTranscript('How are you?', 1000, 2000);

      const stats = actionDetector.getStats();
      expect(stats.segmentCount).toBe(2);
      expect(stats.totalTextLength).toBe('Hello world How are you?'.length);
      expect(stats.sessionDuration).toBeGreaterThan(0);
      expect(stats.isRunning).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear all segments', () => {
      actionDetector.addTranscript('Hello world', 0, 1000);
      actionDetector.addTranscript('How are you?', 1000, 2000);

      expect(actionDetector.getStats().segmentCount).toBe(2);

      actionDetector.clear();

      expect(actionDetector.getStats().segmentCount).toBe(0);
      expect(actionDetector.getPlainTranscript()).toBe('');
      expect(actionDetector.getFullTranscript()).toBe('');
    });

    it('should emit cleared event', (done) => {
      actionDetector.on('cleared', () => {
        done();
      });

      actionDetector.clear();
    });
  });

  describe('getRecentSegments', () => {
    it('should return segments added within the specified time', async () => {
      actionDetector.addTranscript('Old segment', 0, 1000);
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));
      
      actionDetector.addTranscript('Recent segment', 1000, 2000);

      const recentSegments = actionDetector.getRecentSegments(50); // Last 50ms
      expect(recentSegments).toHaveLength(1);
      expect(recentSegments[0].text).toBe('Recent segment');
    });
  });
});
