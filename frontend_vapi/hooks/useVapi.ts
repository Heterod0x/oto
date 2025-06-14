/**
 * VAPI Integration Hook
 * Provides voice assistant functionality using VAPI AI
 */

import { usePrivy } from "@privy-io/react-auth";
import Vapi from "@vapi-ai/web";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface VapiMessage {
  type: "message" | "speech-start" | "speech-end" | "call-start" | "call-end" | "error";
  content?: string;
  timestamp?: number;
}

export interface UseVapiOptions {
  assistantId?: string;
  onMessage?: (message: VapiMessage) => void;
  onError?: (error: Error) => void;
  onCallStart?: () => void;
  onCallEnd?: () => void;
}

/**
 * Custom hook for VAPI integration
 */
export function useVapi(options: UseVapiOptions = {}) {
  const { user } = usePrivy();
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);

  // Get VAPI API key from environment
  const vapiKey = process.env.NEXT_PUBLIC_VAPI_KEY;

  // Get user ID from Privy authentication (similar to TaskList implementation)
  const userId = useMemo(() => {
    const walletAddress = user?.wallet?.address;
    const privyId = user?.id;

    // Use wallet address if available (shorter and more standard)
    if (walletAddress) {
      console.log("👤 Using wallet address as user ID for VAPI:", walletAddress);
      return walletAddress;
    }

    // Fallback to Privy ID but truncate if too long
    if (privyId) {
      const truncatedId = privyId.length > 42 ? privyId.substring(0, 42) : privyId;
      console.log("👤 Using truncated Privy ID as user ID for VAPI:", truncatedId);
      return truncatedId;
    }

    console.warn("⚠️ No user ID available for VAPI");
    return "anonymous";
  }, [user]);

  // Initialize VAPI client
  useEffect(() => {
    if (!vapiKey) {
      console.warn("⚠️ VAPI key not configured");
      setError("VAPI key not configured. Please check environment variables.");
      return;
    }

    try {
      console.log("🤖 Initializing VAPI client...");
      const vapiInstance = new Vapi(vapiKey);
      setVapi(vapiInstance);
      console.log("✅ VAPI client initialized successfully");
    } catch (err) {
      console.error("❌ Failed to initialize VAPI:", err);
      setError("Failed to initialize VAPI client");
    }
  }, [vapiKey]);

  // Set up VAPI event listeners
  useEffect(() => {
    if (!vapi) return;

    console.log("🔊 Setting up VAPI event listeners...");

    // Call start event
    const handleCallStart = () => {
      console.log("📞 VAPI call started");
      setIsCallActive(true);
      setIsConnecting(false);
      setError(null);
      options.onCallStart?.();
      options.onMessage?.({
        type: "call-start",
        content: "Call started",
        timestamp: Date.now(),
      });
    };

    // Call end event
    const handleCallEnd = () => {
      console.log("📞 VAPI call ended");
      setIsCallActive(false);
      setIsConnecting(false);
      setVolume(0);
      options.onCallEnd?.();
      options.onMessage?.({
        type: "call-end",
        content: "Call ended",
        timestamp: Date.now(),
      });
    };

    // Speech start event
    const handleSpeechStart = () => {
      console.log("🎤 User speech started");
      options.onMessage?.({
        type: "speech-start",
        content: "Speech started",
        timestamp: Date.now(),
      });
    };

    // Speech end event
    const handleSpeechEnd = () => {
      console.log("🎤 User speech ended");
      options.onMessage?.({
        type: "speech-end", 
        content: "Speech ended",
        timestamp: Date.now(),
      });
    };

    // Message event (transcript)
    const handleMessage = (message: any) => {
      console.log("💬 VAPI message received:", message);
      options.onMessage?.({
        type: "message",
        content: message.content || message.transcript || JSON.stringify(message),
        timestamp: Date.now(),
      });
    };

    // Error event
    const handleError = (error: any) => {
      console.error("❌ VAPI error:", error);
      const errorMessage = error.message || error.toString() || "Unknown VAPI error";
      setError(errorMessage);
      setIsCallActive(false);
      setIsConnecting(false);
      options.onError?.(new Error(errorMessage));
      options.onMessage?.({
        type: "error",
        content: errorMessage,
        timestamp: Date.now(),
      });
    };

    // Volume level event (if available)
    const handleVolumeLevel = (level: number) => {
      setVolume(level);
    };

    // Register event listeners
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("message", handleMessage);
    vapi.on("error", handleError);
    vapi.on("volume-level", handleVolumeLevel);

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up VAPI event listeners...");
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
      vapi.off("volume-level", handleVolumeLevel);
    };
  }, [vapi, options]);

  /**
   * Start VAPI call with assistant
   */
  const startCall = useCallback(async (assistantId?: string) => {
    if (!vapi) {
      const error = "VAPI client not initialized";
      console.error("❌", error);
      setError(error);
      return false;
    }

    if (!userId) {
      const error = "User ID not available";
      console.error("❌", error);
      setError(error);
      return false;
    }

    if (isCallActive) {
      console.warn("⚠️ Call already active");
      return false;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const targetAssistantId = assistantId || options.assistantId;
      if (!targetAssistantId) {
        throw new Error("Assistant ID not provided");
      }

      console.log("🚀 Starting VAPI call with assistant:", targetAssistantId);
      console.log("👤 User ID:", userId);

      // Start call with metadata containing OTO_USER_ID
      await vapi.start(targetAssistantId, {
        metadata: {
          "OTO_USER_ID": userId,
        },
      });

      console.log("✅ VAPI call started successfully");
      return true;
    } catch (err) {
      console.error("❌ Failed to start VAPI call:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to start call";
      setError(errorMessage);
      setIsConnecting(false);
      return false;
    }
  }, [vapi, userId, options.assistantId, isCallActive]);

  /**
   * Stop VAPI call
   */
  const stopCall = useCallback(async () => {
    if (!vapi) {
      console.warn("⚠️ VAPI client not initialized");
      return false;
    }

    if (!isCallActive && !isConnecting) {
      console.warn("⚠️ No active call to stop");
      return false;
    }

    try {
      console.log("🛑 Stopping VAPI call...");
      await vapi.stop();
      console.log("✅ VAPI call stopped successfully");
      return true;
    } catch (err) {
      console.error("❌ Failed to stop VAPI call:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to stop call";
      setError(errorMessage);
      return false;
    }
  }, [vapi, isCallActive, isConnecting]);

  /**
   * Check if VAPI is ready to use
   */
  const isReady = useMemo(() => {
    return !!(vapi && vapiKey && userId);
  }, [vapi, vapiKey, userId]);

  /**
   * Send message to assistant (if supported)
   */
  const sendMessage = useCallback(async (message: string) => {
    if (!vapi || !isCallActive) {
      console.warn("⚠️ Cannot send message: VAPI not active");
      return false;
    }

    try {
      console.log("💬 Sending message to VAPI:", message);
      // Note: This depends on VAPI API - check if message sending is supported
      if (typeof vapi.send === "function") {
        await vapi.send(message);
        return true;
      } else {
        console.warn("⚠️ Message sending not supported by current VAPI version");
        return false;
      }
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      return false;
    }
  }, [vapi, isCallActive]);

  return {
    // State
    isReady,
    isCallActive,
    isConnecting,
    error,
    volume,
    userId,
    
    // Actions
    startCall,
    stopCall,
    sendMessage,
    
    // Configuration
    vapiKey: !!vapiKey,
  };
}
