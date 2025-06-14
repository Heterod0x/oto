import { AlertCircle, Bot, MessageSquare, Mic, MicOff, Volume2 } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useVapi, type VapiMessage } from "../hooks/useVapi";
import { cn } from "../lib/utils";
import { LoadingSpinner } from "./LoadingSpinner";
import { Button } from "./ui/button";

export interface AgentChatProps {
  className?: string;
  assistantId?: string;
}

/**
 * Agent Chat Screen Component
 * Provides VAPI voice conversation functionality
 */
export function AgentChat({ className, assistantId }: AgentChatProps) {
  const router = useRouter();
  
  // Messages state for conversation display
  const [messages, setMessages] = useState<VapiMessage[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Get VAPI assistant ID from props or environment
  const vapiAssistantId = assistantId || process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

  // VAPI integration hook
  const {
    isReady,
    isCallActive,
    isConnecting,
    error: vapiError,
    volume,
    userId,
    startCall,
    stopCall,
    vapiKey,
  } = useVapi({
    assistantId: vapiAssistantId,
    onMessage: (message: VapiMessage) => {
      console.log("📨 VAPI message received:", message);
      setMessages(prev => [...prev, message]);
    },
    onError: (error: Error) => {
      console.error("❌ VAPI error:", error);
      setLocalError(error.message);
    },
    onCallStart: () => {
      console.log("📞 Call started - clearing previous messages");
      setMessages([]);
      setLocalError(null);
    },
    onCallEnd: () => {
      console.log("📞 Call ended - navigating to tasks");
      // Navigate to tasks after a short delay
      setTimeout(() => {
        router.push("/tasks");
      }, 1500);
    },
  });

  // Combined error state
  const error = vapiError || localError;

  /**
   * Start VAPI call
   */
  const handleStartCall = useCallback(async () => {
    if (!isReady) {
      setLocalError("VAPI not ready. Please check configuration.");
      return;
    }

    if (!vapiAssistantId) {
      setLocalError("Assistant ID not configured. Please set NEXT_PUBLIC_VAPI_ASSISTANT_ID.");
      return;
    }

    setLocalError(null);
    const success = await startCall(vapiAssistantId);
    
    if (!success) {
      setLocalError("Failed to start call. Please try again.");
    }
  }, [isReady, vapiAssistantId, startCall]);

  /**
   * Stop VAPI call
   */
  const handleStopCall = useCallback(async () => {
    const success = await stopCall();
    
    if (!success) {
      setLocalError("Failed to stop call. Please try again.");
    }
  }, [stopCall]);

  /**
   * Keyboard event handler (spacebar to start/stop call)
   */
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" && !isConnecting) {
        event.preventDefault();
        if (isCallActive) {
          handleStopCall();
        } else {
          handleStartCall();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isCallActive, isConnecting, handleStartCall, handleStopCall]);

  // Volume indicator styles
  const volumeStyle = {
    transform: `scale(${1 + volume / 100})`,
    opacity: isCallActive ? 0.3 + (volume / 100) * 0.7 : 1,
  };

  // Configuration check
  const hasConfiguration = vapiKey && vapiAssistantId;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 p-6",
        className,
      )}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
          <Bot size={32} className="text-violet-600" />
          Chat with Agent
        </h1>
        <p className="text-gray-600">Press the mic button to start voice conversation</p>
        {userId && (
          <p className="text-sm text-gray-500 mt-2">User: {userId.slice(0, 8)}...</p>
        )}
      </div>

      {/* Configuration Status */}
      {!hasConfiguration && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg max-w-md text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle size={16} />
            <span className="font-medium">Configuration Required</span>
          </div>
          <p className="text-sm">
            {!vapiKey && "VAPI key not configured. "}
            {!vapiAssistantId && "Assistant ID not configured. "}
            Please check environment variables.
          </p>
        </div>
      )}

      {/* Main control area */}
      <div className="relative mb-8">
        {/* Volume visualization ring */}
        {isCallActive && (
          <div
            className="absolute inset-0 rounded-full border-4 border-violet-300 animate-pulse"
            style={volumeStyle}
          />
        )}

        {/* Main call button */}
        <Button
          size="lg"
          variant={isCallActive ? "destructive" : "default"}
          className={cn(
            "w-24 h-24 rounded-full shadow-lg transition-all duration-300",
            isCallActive
              ? "bg-red-500 hover:bg-red-600 scale-110"
              : "bg-violet-600 hover:bg-violet-700",
            (isConnecting || !hasConfiguration) && "opacity-75 cursor-not-allowed",
          )}
          onClick={isCallActive ? handleStopCall : handleStartCall}
          disabled={isConnecting || !hasConfiguration}
          aria-label={
            isConnecting
              ? "Connecting..."
              : isCallActive
                ? "End call"
                : "Start call"
          }
          aria-pressed={isCallActive}
        >
          {isConnecting ? (
            <LoadingSpinner size="lg" color="white" />
          ) : isCallActive ? (
            <MicOff size={32} />
          ) : (
            <Mic size={32} />
          )}
        </Button>
      </div>

      {/* Status text */}
      <div className="text-center mb-6">
        {isConnecting ? (
          <p className="text-violet-600 font-medium">Connecting to assistant...</p>
        ) : isCallActive ? (
          <div className="space-y-2">
            <p className="text-red-600 font-medium flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Call Active
            </p>
            <p className="text-sm text-gray-500">Speak naturally with the assistant</p>
          </div>
        ) : (
          <p className="text-gray-600">
            {hasConfiguration 
              ? "Press the button to start voice conversation"
              : "Please configure VAPI settings to continue"
            }
          </p>
        )}
      </div>

      {/* Volume level display */}
      {isCallActive && (
        <div className="w-64 bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-violet-600 h-2 rounded-full transition-all duration-100"
            style={{ width: `${Math.min(100, volume)}%` }}
          />
        </div>
      )}

      {/* Messages display */}
      {messages.length > 0 && (
        <div className="w-full max-w-md mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare size={16} />
              Conversation
            </h3>
            <div className="space-y-2">
              {messages.slice(-5).map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-2 rounded text-sm",
                    message.type === "error"
                      ? "bg-red-50 text-red-700"
                      : message.type === "call-start" || message.type === "call-end"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-50 text-gray-700"
                  )}
                >
                  <span className="font-medium capitalize">{message.type}:</span>{" "}
                  {message.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <AlertCircle size={16} />
            <span className="font-medium">Error</span>
          </div>
          <p className="text-sm">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-red-600 hover:text-red-700"
            onClick={() => setLocalError(null)}
          >
            Dismiss
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
            <li>• Press mic button or spacebar to start call</li>
            <li>• Speak naturally about your tasks and goals</li>
            <li>• The assistant will extract and create tasks</li>
            <li>• Press the button again to end call</li>
            <li>• View extracted tasks on the tasks screen</li>
          </ul>
        </div>
      </div>

      {/* Ready status indicator */}
      <div className="fixed bottom-4 right-4">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium",
            isReady
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          )}
        >
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              isReady ? "bg-green-500" : "bg-yellow-500"
            )}
          />
          {isReady ? "Ready" : "Not Ready"}
        </div>
      </div>
    </div>
  );
}
