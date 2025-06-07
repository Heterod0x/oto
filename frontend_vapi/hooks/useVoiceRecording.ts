import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseVoiceRecordingOptions {
  onStreamData?: (data: Blob) => void;
  onError?: (error: Error) => void;
  sampleRate?: number;
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
}

export interface UseVoiceRecordingReturn {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  volume: number;
}

/**
 * Custom hook for voice recording and streaming
 * Realizes real-time voice streaming using browser's Web Audio API
 */
export function useVoiceRecording({
  onStreamData,
  onError,
  sampleRate = 16000,
  echoCancellation = true,
  noiseSuppression = true,
}: UseVoiceRecordingOptions = {}): UseVoiceRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [volume, setVolume] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Request microphone permission
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate,
          echoCancellation,
          noiseSuppression,
          autoGainControl: true,
        },
      });

      // Stop temporarily acquired stream for testing
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error('Failed to get microphone permission:', error);
      setHasPermission(false);
      onError?.(error as Error);
      return false;
    }
  }, [sampleRate, echoCancellation, noiseSuppression, onError]);

  /**
   * Monitor volume level
   */
  const monitorVolume = useCallback(() => {
    if (!analyzerRef.current) return;

    const analyzer = analyzerRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVolume = () => {
      if (!isRecording) return;

      analyzer.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / bufferLength;
      const normalizedVolume = Math.min(100, (average / 255) * 100);
      
      setVolume(normalizedVolume);

      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();
  }, [isRecording]);

  /**
   * Start recording
   */
  const startRecording = useCallback(async () => {
    try {
      if (!hasPermission) {
        const permitted = await requestPermission();
        if (!permitted) {
          throw new Error('Microphone permission denied');
        }
      }

      // Get media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate,
          echoCancellation,
          noiseSuppression,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Audio Context for volume monitoring
      audioContextRef.current = new AudioContext({ sampleRate });
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
      source.connect(analyzerRef.current);

      // MediaRecorder for streaming
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        audioBitsPerSecond: 128000,
      });

      mediaRecorderRef.current = mediaRecorder;

      // Data reception processing (streaming)
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && onStreamData) {
          onStreamData(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        onError?.(new Error('Recording failed'));
      };

      // Send data every 100ms (for streaming)
      mediaRecorder.start(100);
      setIsRecording(true);

      // Start volume monitoring
      monitorVolume();

    } catch (error) {
      console.error('Failed to start recording:', error);
      onError?.(error as Error);
    }
  }, [hasPermission, requestPermission, sampleRate, echoCancellation, noiseSuppression, onStreamData, onError, monitorVolume]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Audio Context cleanup
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setVolume(0);
  }, [isRecording]);

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  // Permission check on initialization
  useEffect(() => {
    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
      setHasPermission(result.state === 'granted');
    }).catch(() => {
      // Keep initial value if Permissions API is not available
    });
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording,
    hasPermission,
    requestPermission,
    volume,
  };
}
