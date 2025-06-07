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
 * 音声録音とストリーミング用のカスタムフック
 * ブラウザのWeb Audio APIを使用してリアルタイム音声ストリーミングを実現
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
   * マイクの権限を要求
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

      // テスト用に一時的に取得したストリームを停止
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
   * 音量レベルの監視
   */
  const monitorVolume = useCallback(() => {
    if (!analyzerRef.current) return;

    const analyzer = analyzerRef.current;
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVolume = () => {
      if (!isRecording) return;

      analyzer.getByteFrequencyData(dataArray);
      
      // 音量の平均値を計算
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / bufferLength;
      const normalizedVolume = Math.min(100, (average / 255) * 100);
      
      setVolume(normalizedVolume);

      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();
  }, [isRecording]);

  /**
   * 録音開始
   */
  const startRecording = useCallback(async () => {
    try {
      if (!hasPermission) {
        const permitted = await requestPermission();
        if (!permitted) {
          throw new Error('Microphone permission denied');
        }
      }

      // メディアストリームを取得
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

      // データの受信処理（ストリーミング）
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && onStreamData) {
          onStreamData(event.data);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        onError?.(new Error('Recording failed'));
      };

      // 100ms間隔でデータを送信（ストリーミング用）
      mediaRecorder.start(100);
      setIsRecording(true);

      // 音量監視開始
      monitorVolume();

    } catch (error) {
      console.error('Failed to start recording:', error);
      onError?.(error as Error);
    }
  }, [hasPermission, requestPermission, sampleRate, echoCancellation, noiseSuppression, onStreamData, onError, monitorVolume]);

  /**
   * 録音停止
   */
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    // ストリーム停止
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Audio Context クリーンアップ
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // アニメーションフレームをキャンセル
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setVolume(0);
  }, [isRecording]);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  // 初期化時に権限チェック
  useEffect(() => {
    navigator.permissions.query({ name: 'microphone' as PermissionName }).then((result) => {
      setHasPermission(result.state === 'granted');
    }).catch(() => {
      // 権限APIが利用できない場合は初期値のまま
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
