import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import { cn } from '../lib/utils';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from './ui/button';

export interface AgentChatProps {
  className?: string;
}

/**
 * Agent Chat Screen Component
 * Provides voice recording and streaming functionality
 */
export function AgentChat({ className }: AgentChatProps) {
  const router = useRouter();
  
  // State management
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Voice recording hook
  const {
    isRecording,
    startRecording,
    stopRecording,
    hasPermission,
    requestPermission,
    volume,
  } = useVoiceRecording({
    onStreamData: (audioBlob) => {
      // Stream audio data via WebSocket
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(audioBlob);
      }
    },
    onError: (error) => {        setError(`Recording error: ${error.message}`);
    },
  });

  /**
   * Start voice session (demo mode support)
   */
  const handleStartRecording = useCallback(async () => {
    try {
      setError(null);
      setIsConnecting(true);

      // Demo mode: simulate without actual recording
      console.log('Demo mode: Starting voice session simulation');
      
      // Simulate recording state after 2 seconds
      setTimeout(() => {
        setIsConnecting(false);
        startRecording();
      }, 2000);

    } catch (error) {
      console.error('Recording start error:', error);
      setError(`Failed to start recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsConnecting(false);
    }
  }, [startRecording]);

  /**
   * End voice session (demo mode support)
   */
  const handleStopRecording = useCallback(async () => {
    try {
      // Stop recording
      stopRecording();

      // Demo mode: navigate to task screen after 2 seconds
      setTimeout(() => {
        router.push('/tasks');
      }, 1000);

    } catch (error) {
      console.error('Recording stop error:', error);
      setError(`Failed to stop recording: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [stopRecording, router]);

  /**
   * Keyboard event handler (spacebar to start/stop recording)
   */
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !isConnecting) {
        event.preventDefault();
        if (isRecording) {
          handleStopRecording();
        } else {
          handleStartRecording();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isRecording, isConnecting, handleStartRecording, handleStopRecording]);

  /**
   * Component unmount cleanup
   */
  useEffect(() => {
    return () => {
      if (websocket) {
        websocket.close();
      }
      if (isRecording) {
        stopRecording();
      }
    };
  }, [websocket, isRecording, stopRecording]);

  // Volume indicator styles
  const volumeStyle = {
    transform: `scale(${1 + volume / 100})`,
    opacity: isRecording ? 0.3 + (volume / 100) * 0.7 : 1,
  };

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 p-6", className)}>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chat with Agent
        </h1>
        <p className="text-gray-600">
          Press the mic button to start conversation
        </p>
      </div>

      {/* Main control area */}
      <div className="relative mb-8">
        {/* Volume visualization ring */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-4 border-violet-300 animate-pulse" 
               style={volumeStyle} />
        )}
        
        {/* Main recording button */}
        <Button
          size="lg"
          variant={isRecording ? "destructive" : "default"}
          className={cn(
            "w-24 h-24 rounded-full shadow-lg transition-all duration-300",
            isRecording 
              ? "bg-red-500 hover:bg-red-600 scale-110" 
              : "bg-violet-600 hover:bg-violet-700",
            isConnecting && "opacity-75 cursor-not-allowed"
          )}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isConnecting}
          aria-label={
            isConnecting 
              ? "Connecting..." 
              : isRecording 
                ? "Stop recording" 
                : "Start recording"
          }
          aria-pressed={isRecording}
        >
          {isConnecting ? (
            <LoadingSpinner size="lg" color="white" />
          ) : isRecording ? (
            <MicOff size={32} />
          ) : (
            <Mic size={32} />
          )}
        </Button>
      </div>

      {/* Status text */}
      <div className="text-center mb-6">
        {isConnecting ? (
          <p className="text-violet-600 font-medium">Connecting...</p>
        ) : isRecording ? (
          <div className="space-y-2">
            <p className="text-red-600 font-medium flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Recording
            </p>
            <p className="text-sm text-gray-500">Press the button again to stop recording</p>
          </div>
        ) : (
          <p className="text-gray-600">Press the button to start recording</p>
        )}
      </div>

      {/* Volume level display */}
      {isRecording && (
        <div className="w-64 bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-violet-600 h-2 rounded-full transition-all duration-100"
            style={{ width: `${Math.min(100, volume)}%` }}
          />
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md text-center">
          <p className="text-sm">{error}</p>            <Button
              variant="ghost"
              size="sm"
              className="mt-2 text-red-600 hover:text-red-700"
              onClick={() => setError(null)}
            >
              Close
            </Button>
        </div>
      )}

      {/* Help text */}
      <div className="mt-12 text-center max-w-md">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Volume2 size={16} />
            How to use
          </h3>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• Press mic button or spacebar to start recording</li>
            <li>• Have a natural conversation with the agent</li>
            <li>• Press the button again to stop recording</li>
            <li>• Automatically navigate to tasks screen</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
