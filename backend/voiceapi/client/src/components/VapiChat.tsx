import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { getVapiConfig } from '../config/env';
import { ApiConfig } from '../types';

interface VapiChatProps {
  onError: (error: string) => void;
  config: ApiConfig;
}

const VapiChat: React.FC<VapiChatProps> = ({ onError, config }) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<Array<{role: string, text: string, timestamp: Date}>>([]);
  const [vapiConfig, setVapiConfig] = useState(getVapiConfig());
  const [userId, setUserId] = useState(config.userId);
  const [customApiKey, setCustomApiKey] = useState(vapiConfig.apiKey);
  const [customAssistantId, setCustomAssistantId] = useState(vapiConfig.assistantId);

  useEffect(() => {
    setUserId(config.userId);
  }, [config]);

  useEffect(() => {
    if (!customApiKey) {
      return;
    }

    const vapiInstance = new Vapi(customApiKey);
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on('call-start', () => {
      console.log('VAPI: Call started');
      setIsConnected(true);
      setTranscript(prev => [...prev, {
        role: 'system',
        text: 'Call started - You can now speak with the AI assistant',
        timestamp: new Date()
      }]);
    });

    vapiInstance.on('call-end', () => {
      console.log('VAPI: Call ended');
      setIsConnected(false);
      setIsSpeaking(false);
      setIsListening(false);
      setTranscript(prev => [...prev, {
        role: 'system',
        text: 'Call ended',
        timestamp: new Date()
      }]);
    });

    vapiInstance.on('speech-start', () => {
      console.log('VAPI: Assistant started speaking');
      setIsSpeaking(true);
    });

    vapiInstance.on('speech-end', () => {
      console.log('VAPI: Assistant stopped speaking');
      setIsSpeaking(false);
    });

    vapiInstance.on('message', (message) => {
      console.log('VAPI: Message received', message);
      
      if (message.type === 'transcript') {
        setTranscript(prev => [...prev, {
          role: message.role || 'unknown',
          text: message.transcript || message.text || 'No transcript available',
          timestamp: new Date()
        }]);
      }
      
      if (message.type === 'function-call') {
        setTranscript(prev => [...prev, {
          role: 'system',
          text: `Function called: ${message.functionCall?.name || 'Unknown function'}`,
          timestamp: new Date()
        }]);
      }
    });

    vapiInstance.on('error', (error) => {
      console.error('VAPI: Error occurred', error);
      onError(`VAPI Error: ${error.message || error}`);
      setTranscript(prev => [...prev, {
        role: 'system',
        text: `Error: ${error.message || error}`,
        timestamp: new Date()
      }]);
    });

    vapiInstance.on('volume-level', (volume) => {
      // You can use this to show volume indicators if needed
      setIsListening(volume > 0.01);
    });

    return () => {
      vapiInstance?.stop();
    };
  }, [customApiKey, onError]);

  const startCall = () => {
    if (!customApiKey || !customAssistantId) {
      onError('Please configure VAPI API Key and Assistant ID');
      return;
    }

    if (vapi) {
      try {
        vapi.start(customAssistantId, {
          metadata: {
              "OTO_USER_ID": userId,
          },
        });
      } catch (error) {
        onError(`Failed to start call: ${error}`);
      }
    }
  };

  const endCall = () => {
    if (vapi) {
      try {
        vapi.stop();
      } catch (error) {
        onError(`Failed to end call: ${error}`);
      }
    }
  };

  const clearTranscript = () => {
    setTranscript([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'user':
        return '#12A594';
      case 'assistant':
        return '#333';
      case 'system':
        return '#666';
      default:
        return '#999';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'user':
        return 'You';
      case 'assistant':
        return 'AI Assistant';
      case 'system':
        return 'System';
      default:
        return role;
    }
  };

  return (
    <div className="vapi-chat">
      <div className="vapi-header">
        <h2>Voice AI Chat (VAPI)</h2>
        <p>Talk directly with an AI assistant using voice interaction</p>
      </div>

      <div className="vapi-config">
        <div className="config-row">
          <div className="config-field">
            <label htmlFor="vapi-api-key">VAPI API Key:</label>
            <input
              id="vapi-api-key"
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="Enter your VAPI public API key"
              disabled={isConnected}
            />
          </div>
          <div className="config-field">
            <label htmlFor="vapi-assistant-id">Assistant ID:</label>
            <input
              id="vapi-assistant-id"
              type="text"
              value={customAssistantId}
              onChange={(e) => setCustomAssistantId(e.target.value)}
              placeholder="Enter your VAPI assistant ID"
              disabled={isConnected}
            />
          </div>
        </div>
      </div>

      <div className="vapi-controls">
        {!isConnected ? (
          <button
            onClick={startCall}
            className="btn-primary vapi-call-btn"
            disabled={!customApiKey || !customAssistantId}
          >
            <Phone size={20} />
            Start Voice Call
          </button>
        ) : (
          <button
            onClick={endCall}
            className="btn-danger vapi-call-btn"
          >
            <PhoneOff size={20} />
            End Call
          </button>
        )}

        <div className="vapi-status">
          {isConnected && (
            <>
              <div className={`status-indicator ${isSpeaking ? 'speaking' : isListening ? 'listening' : 'idle'}`}>
                <Mic size={16} />
                {isSpeaking ? 'AI Speaking' : isListening ? 'Listening' : 'Ready'}
              </div>
              {(isSpeaking || isListening) && (
                <div className="audio-visualizer">
                  <div className="pulse-dot"></div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="vapi-transcript">
        <div className="transcript-header">
          <h3>Conversation Transcript</h3>
          {transcript.length > 0 && (
            <button onClick={clearTranscript} className="btn-clear">
              Clear Transcript
            </button>
          )}
        </div>
        
        <div className="transcript-content">
          {transcript.length === 0 ? (
            <div className="transcript-empty">
              <p>No conversation yet. Start a voice call to begin talking with the AI assistant.</p>
              {(!customApiKey || !customAssistantId) && (
                <p className="config-warning">
                  ⚠️ Please configure your VAPI API Key and Assistant ID above to get started.
                </p>
              )}
            </div>
          ) : (
            <div className="transcript-messages">
              {transcript.map((msg, index) => (
                <div
                  key={index}
                  className={`transcript-message ${msg.role}`}
                >
                  <div className="message-header">
                    <span className="message-role" style={{ color: getRoleColor(msg.role) }}>
                      {getRoleLabel(msg.role)}
                    </span>
                    <span className="message-time">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <div className="message-content">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .vapi-chat {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .vapi-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .vapi-header h2 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .vapi-header p {
          margin: 0;
          color: #666;
        }

        .vapi-config {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .config-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .config-field {
          display: flex;
          flex-direction: column;
        }

        .config-field label {
          font-weight: bold;
          margin-bottom: 5px;
          color: #333;
        }

        .config-field input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .config-field input:disabled {
          background: #f5f5f5;
          color: #999;
        }

        .vapi-controls {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          background: #fff;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
        }

        .vapi-call-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .vapi-call-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #12A594;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0f8a7a;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover {
          background: #c82333;
        }

        .vapi-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
        }

        .status-indicator.idle {
          background: #e9ecef;
          color: #6c757d;
        }

        .status-indicator.listening {
          background: #d4edda;
          color: #155724;
        }

        .status-indicator.speaking {
          background: #f8d7da;
          color: #721c24;
        }

        .audio-visualizer {
          display: flex;
          align-items: center;
        }

        .pulse-dot {
          width: 12px;
          height: 12px;
          background: #12A594;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .vapi-transcript {
          background: #fff;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          overflow: hidden;
        }

        .transcript-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e1e5e9;
        }

        .transcript-header h3 {
          margin: 0;
          color: #333;
        }

        .btn-clear {
          background: #6c757d;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-clear:hover {
          background: #5a6268;
        }

        .transcript-content {
          max-height: 500px;
          overflow-y: auto;
          padding: 20px;
        }

        .transcript-empty {
          text-align: center;
          color: #666;
          padding: 40px 20px;
        }

        .config-warning {
          color: #856404;
          background: #fff3cd;
          padding: 10px;
          border-radius: 4px;
          margin-top: 15px;
        }

        .transcript-messages {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .transcript-message {
          padding: 12px;
          border-radius: 8px;
          background: #f8f9fa;
        }

        .transcript-message.user {
          background: #e3f2fd;
          margin-left: 20px;
        }

        .transcript-message.assistant {
          background: #f3e5f5;
          margin-right: 20px;
        }

        .transcript-message.system {
          background: #fff3e0;
          font-style: italic;
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .message-role {
          font-weight: bold;
          font-size: 14px;
        }

        .message-time {
          font-size: 12px;
          color: #666;
        }

        .message-content {
          line-height: 1.4;
          color: #333;
        }

        @media (max-width: 768px) {
          .config-row {
            grid-template-columns: 1fr;
          }
          
          .vapi-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
          }
          
          .transcript-message.user {
            margin-left: 10px;
          }
          
          .transcript-message.assistant {
            margin-right: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default VapiChat;
