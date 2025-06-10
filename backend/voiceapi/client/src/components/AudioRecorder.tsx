import React, { useRef } from 'react';
import { Mic, Square, Loader2, Upload, Play, RotateCcw } from 'lucide-react';
import { WebSocketService } from '../services/websocket';
import { WebSocketMessage, DetectedAction, TranscriptSegment, TranscriptBeautifyData } from '../types';

interface AudioRecorderProps {
  wsService: WebSocketService;
  conversationId: string;
  onTranscriptSegment: (segment: TranscriptSegment) => void;
  onTranscriptBeautify: (beautifyData: TranscriptBeautifyData) => void;
  onActionDetected: (action: DetectedAction) => void;
  onError: (error: string) => void;
  // Recording state props
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  isStoppingRecording: boolean;
  setIsStoppingRecording: (stopping: boolean) => void;
  connectionStatus: string;
  setConnectionStatus: (status: string) => void;
  inputMode: 'microphone' | 'file';
  setInputMode: (mode: 'microphone' | 'file') => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  isFileLoaded: boolean;
  setIsFileLoaded: (loaded: boolean) => void;
  fileDuration: number;
  setFileDuration: (duration: number) => void;
  currentFileTime: number;
  setCurrentFileTime: (time: number) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  wsService,
  conversationId,
  onTranscriptSegment,
  onTranscriptBeautify,
  onActionDetected,
  onError,
  isConnected,
  setIsConnected,
  isRecording,
  setIsRecording,
  isStoppingRecording,
  setIsStoppingRecording,
  connectionStatus,
  setConnectionStatus,
  inputMode,
  setInputMode,
  selectedFile,
  setSelectedFile,
  isFileLoaded,
  setIsFileLoaded,
  fileDuration,
  setFileDuration,
  currentFileTime,
  setCurrentFileTime
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConnect = async () => {
    try {
      setConnectionStatus('Connecting...');
      await wsService.connect(conversationId);
      
      wsService.onMessage((message: WebSocketMessage) => {
        switch (message.type) {
          case 'transcribe':
            if (message.data) {
              // Handle new transcribe message format with audioStart/audioEnd
              const segment: TranscriptSegment = {
                audioStart: message.data.audioStart || 0,
                audioEnd: message.data.audioEnd || 0,
                transcript: message.data.transcript,
                finalized: message.data.finalized,
                beautified: false,
                id: message.data.finalized 
                  ? `${message.data.audioStart || 0}-${message.data.audioEnd || 0}` 
                  : 'partial-current', // Use simple ID for partial transcripts
              };
              
              // Call onTranscriptSegment for both partial and final transcripts
              // This allows users to see transcription progress in real-time
              if (message.data.transcript && message.data.transcript.trim()) {
                onTranscriptSegment(segment);
              }
            }
            break;
          case 'transcript-beautify':
            if (message.data) {
              const beautifyData: TranscriptBeautifyData = {
                audioStart: message.data.audioStart,
                audioEnd: message.data.audioEnd,
                transcript: message.data.transcript,
                segments: message.data.segments,
              };
              onTranscriptBeautify(beautifyData);
            }
            break;
          case 'detect-action':
            if (message.data) {
              onActionDetected(message.data);
            }
            break;
          case 'error':
            onError(message.message || 'WebSocket error');
            break;
        }
      });

      // Set up WebSocket close event listener
      wsService.onClose(() => {
        setIsStoppingRecording(false);
        setIsConnected(false);
        setIsRecording(false);
        setConnectionStatus('Disconnected');
      });

      setIsConnected(true);
      setConnectionStatus('Connected');
    } catch (error) {
      setConnectionStatus('Connection failed');
      onError(`Failed to connect: ${error}`);
    }
  };

  const handleDisconnect = () => {
    wsService.disconnect();
    setIsConnected(false);
    setIsRecording(false);
    setIsStoppingRecording(false);
    setConnectionStatus('Disconnected');
  };

  const handleStartRecording = async () => {
    if (!isConnected) {
      onError('Please connect first');
      return;
    }

    try {
      await wsService.startRecording();
      setIsRecording(true);
    } catch (error) {
      onError(`Failed to start recording: ${error}`);
    }
  };

  const handleStopRecording = () => {
    setIsStoppingRecording(true);
    wsService.stopRecording();
    setIsRecording(false);
  };

  // File mode handlers
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setSelectedFile(file);
      await wsService.loadAudioFile(file);
      setIsFileLoaded(true);
      setFileDuration(wsService.getFileDuration());
      setCurrentFileTime(0);
      console.log(`Audio file loaded: ${file.name}`);
    } catch (error) {
      onError(`Failed to load audio file: ${error}`);
      setSelectedFile(null);
      setIsFileLoaded(false);
    }
  };

  const handleStartFilePlayback = async () => {
    if (!isConnected) {
      onError('Please connect first');
      return;
    }

    if (!isFileLoaded) {
      onError('Please select an audio file first');
      return;
    }

    try {
      await wsService.startFilePlayback();
      setIsRecording(true); // Use same state for UI consistency
      
      // Update progress periodically
      const progressInterval = setInterval(() => {
        if (wsService.isFilePlaybackActive()) {
          setCurrentFileTime(wsService.getCurrentFileTime());
        } else {
          clearInterval(progressInterval);
          setIsRecording(false);
          setCurrentFileTime(0);
        }
      }, 100);
    } catch (error) {
      onError(`Failed to start file playback: ${error}`);
    }
  };

  const handleStopFilePlayback = () => {
    setIsStoppingRecording(true);
    wsService.stopFilePlayback();
    setIsRecording(false);
    setCurrentFileTime(0);
  };

  const handleClearFile = () => {
    wsService.clearAudioFile();
    setSelectedFile(null);
    setIsFileLoaded(false);
    setFileDuration(0);
    setCurrentFileTime(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isFileLoaded || fileDuration === 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const progressBarWidth = rect.width;
    const clickRatio = clickX / progressBarWidth;
    const seekTime = clickRatio * fileDuration;

    // Clamp to valid range
    const clampedSeekTime = Math.max(0, Math.min(seekTime, fileDuration));
    
    wsService.seekFilePlayback(clampedSeekTime);
    setCurrentFileTime(clampedSeekTime);
    
    console.log(`Seeking to ${clampedSeekTime.toFixed(2)}s`);
  };

  return (
    <div className="audio-recorder">
      <div className="recorder-header">
        <h3>Audio Recorder</h3>
        <div className={`status ${connectionStatus.toLowerCase().replace(' ', '-')}`}>
          {connectionStatus}
        </div>
      </div>

      {/* Input Mode Selection */}
      <div className="input-mode-selection">
        <div className="mode-tabs">
          <button
            className={`mode-tab ${inputMode === 'microphone' ? 'active' : ''}`}
            onClick={() => setInputMode('microphone')}
            disabled={isRecording || isStoppingRecording}
          >
            <Mic size={16} />
            Microphone
          </button>
          <button
            className={`mode-tab ${inputMode === 'file' ? 'active' : ''}`}
            onClick={() => setInputMode('file')}
            disabled={isRecording || isStoppingRecording}
          >
            <Upload size={16} />
            Audio File
          </button>
        </div>
      </div>

      {/* File Selection (only shown in file mode) */}
      {inputMode === 'file' && (
        <div className="file-selection">
          <div className="file-input-section">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-secondary"
              disabled={isRecording || isStoppingRecording}
            >
              <Upload size={16} />
              Select Audio File
            </button>
            {selectedFile && (
              <div className="file-info">
                <span className="file-name">{selectedFile.name}</span>
                {isFileLoaded && (
                  <span className="file-duration">({formatTime(fileDuration)})</span>
                )}
                <button
                  onClick={handleClearFile}
                  className="btn-clear-file"
                  disabled={isRecording || isStoppingRecording}
                  title="Clear file"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            )}
          </div>
          
          {isFileLoaded && (
            <div className="file-progress">
              <div 
                className="progress-bar clickable"
                onClick={handleProgressBarClick}
                title="Click to seek"
              >
                <div 
                  className="progress-fill"
                  style={{ width: `${(currentFileTime / fileDuration) * 100}%` }}
                />
              </div>
              <div className="time-display">
                {formatTime(currentFileTime)} / {formatTime(fileDuration)}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="recorder-controls">
        {!isConnected ? (
          <button onClick={handleConnect} className="btn-primary">
            Connect
          </button>
        ) : (
          <button 
            onClick={handleDisconnect} 
            className="btn-secondary"
            hidden={isRecording || isStoppingRecording}
          >
            Disconnect
          </button>
        )}

        {isConnected && (
          <div className="recording-controls">
            {!isRecording && !isStoppingRecording ? (
              inputMode === 'microphone' ? (
                <button 
                  onClick={handleStartRecording} 
                  className="btn-record"
                  title="Start Recording"
                >
                  <Mic size={24} />
                  Start Recording
                </button>
              ) : (
                <button 
                  onClick={handleStartFilePlayback} 
                  className="btn-record"
                  title="Start File Playback"
                  disabled={!isFileLoaded}
                >
                  <Play size={24} />
                  Start Playback
                </button>
              )
            ) : !isStoppingRecording ? (
              <button 
                onClick={inputMode === 'microphone' ? handleStopRecording : handleStopFilePlayback} 
                className="btn-stop"
                title={inputMode === 'microphone' ? "Stop Recording" : "Stop Playback"}
              >
                <Square size={24} />
                {inputMode === 'microphone' ? 'Stop Recording' : 'Stop Playback'}
              </button>
            ) : (
              <div className="stopping-indicator">
                <div className="animate-spin" style={{ width: '16px', height: '16px', display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Loader2 size={16} />
                </div>
                Stopping... (& Saving...)
              </div>
            )}
          </div>
        )}
      </div>

      <div className="recorder-info">
        <p><strong>Conversation ID:</strong> {conversationId}</p>
        <p><strong>Input Mode:</strong> {inputMode === 'microphone' ? 'Microphone' : 'Audio File'}</p>
        {isRecording && (
          <div className="recording-indicator">
            <div className="pulse"></div>
            {inputMode === 'microphone' ? 'Recording...' : 'Playing back file...'}
          </div>
        )}
      </div>
    </div>
  );
};
