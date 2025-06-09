import React, { useState, useRef } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { WebSocketService } from '../services/websocket';
import { WebSocketMessage, DetectedAction } from '../types';

interface AudioRecorderProps {
  wsService: WebSocketService;
  conversationId: string;
  onTranscript: (transcript: string, finalized: boolean) => void;
  onActionDetected: (action: DetectedAction) => void;
  onError: (error: string) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  wsService,
  conversationId,
  onTranscript,
  onActionDetected,
  onError
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');

  const handleConnect = async () => {
    try {
      setConnectionStatus('Connecting...');
      await wsService.connect(conversationId);
      
      wsService.onMessage((message: WebSocketMessage) => {
        switch (message.type) {
          case 'transcribe':
            if (message.data) {
              onTranscript(message.data.transcript, message.data.finalized);
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
    wsService.stopRecording();
    setIsRecording(false);
  };

  return (
    <div className="audio-recorder">
      <div className="recorder-header">
        <h3>Audio Recorder</h3>
        <div className={`status ${connectionStatus.toLowerCase().replace(' ', '-')}`}>
          {connectionStatus}
        </div>
      </div>

      <div className="recorder-controls">
        {!isConnected ? (
          <button onClick={handleConnect} className="btn-primary">
            Connect to WebSocket
          </button>
        ) : (
          <button onClick={handleDisconnect} className="btn-secondary">
            Disconnect
          </button>
        )}

        {isConnected && (
          <div className="recording-controls">
            {!isRecording ? (
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
                onClick={handleStopRecording} 
                className="btn-stop"
                title="Stop Recording"
              >
                <Square size={24} />
                Stop Recording
              </button>
            )}
          </div>
        )}
      </div>

      <div className="recorder-info">
        <p><strong>Conversation ID:</strong> {conversationId}</p>
        {isRecording && (
          <div className="recording-indicator">
            <div className="pulse"></div>
            Recording...
          </div>
        )}
      </div>
    </div>
  );
};
