import { useCallback, useEffect, useRef, useState } from "react";

export interface UseRealtimeAudioStreamOptions {
  onAudioData?: (audioData: Blob) => void;
  onError?: (error: Error) => void;
  sampleRate?: number;
  chunkInterval?: number;
}

export interface UseRealtimeAudioStreamReturn {
  isStreaming: boolean;
  startStreaming: () => Promise<void>;
  stopStreaming: () => void;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  volume: number;
}

/**
 * Custom hook for real-time audio streaming via WebSocket
 * Uses MediaRecorder for compatibility (following reference implementation)
 */
export function useRealtimeAudioStream({
  onAudioData,
  onError,
  sampleRate = 16000,
  chunkInterval = 100,
}: UseRealtimeAudioStreamOptions = {}): UseRealtimeAudioStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [volume, setVolume] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Request microphone permission
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      // Use exact audio constraints from reference implementation
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Stop the test stream
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      return true;
    } catch (error) {
      console.error("Failed to get microphone permission:", error);
      setHasPermission(false);
      onError?.(error as Error);
      return false;
    }
  }, [sampleRate, onError]);

  /**
   * Monitor volume level
   */
  const monitorVolume = useCallback(() => {
    if (!analyzerRef.current || !isStreaming) return;

    const analyzer = analyzerRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVolume = () => {
      if (!isStreaming) return;

      analyzer.getByteFrequencyData(dataArray);

      // Calculate average volume
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / bufferLength;
      const normalizedVolume = Math.min(100, (average / 255) * 100);

      setVolume(normalizedVolume);
      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();
  }, [isStreaming]);

  /**
   * Start real-time audio streaming (using MediaRecorder like reference implementation)
   */
  const startStreaming = useCallback(async () => {
    try {
      if (!hasPermission) {
        const permitted = await requestPermission();
        if (!permitted) {
          throw new Error("Microphone permission denied");
        }
      }

      console.log("🎤 Starting real-time audio streaming...");

      // Get media stream with exact settings from reference implementation
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;

      // Create Audio Context for volume monitoring
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      const source = audioContextRef.current.createMediaStreamSource(stream);

      // Create analyzer for volume monitoring
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;
      source.connect(analyzerRef.current);

      // Setup MediaRecorder exactly like reference implementation
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          onAudioData?.(event.data);
        }
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        onError?.(new Error("Recording failed"));
      };

      // Start recording with 100ms chunks (same as reference)
      mediaRecorderRef.current.start(100);
      setIsStreaming(true);
      
      // Start volume monitoring
      monitorVolume();

      console.log("✅ Real-time audio streaming started");
    } catch (error) {
      console.error("Failed to start audio streaming:", error);
      onError?.(error as Error);
    }
  }, [
    hasPermission,
    requestPermission,
    sampleRate,
    chunkInterval,
    onAudioData,
    onError,
    monitorVolume,
    isStreaming,
  ]);

  /**
   * Stop real-time audio streaming
   */
  const stopStreaming = useCallback(() => {
    console.log("🛑 Stopping real-time audio streaming...");

    setIsStreaming(false);

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }

    // Stop analyzer
    if (analyzerRef.current) {
      analyzerRef.current.disconnect();
      analyzerRef.current = null;
    }

    // Stop stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close audio context
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
    console.log("✅ Audio streaming stopped");
  }, []);

  // Permission check on initialization
  useEffect(() => {
    navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((result) => {
        setHasPermission(result.state === "granted");
      })
      .catch(() => {
        // Keep initial value if Permissions API is not available
      });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, [stopStreaming]);

  return {
    isStreaming,
    startStreaming,
    stopStreaming,
    hasPermission,
    requestPermission,
    volume,
  };
}
