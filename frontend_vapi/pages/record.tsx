import { usePrivy } from "@privy-io/react-auth";
import { Mic, MicOff, Square } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FooterNavigation } from "../components/FooterNavigation";
import { Button } from "../components/ui/button";
import { useRealtimeAudioStream } from "../hooks/useRealtimeAudioStream";
import {
  generateUUID,
  sendCompleteSignal,
  sendRealtimeAudioData,
  validateUUID
} from "../lib/oto-api";

/**
 * 日常会話録音画面 - リアルタイム音声ストリーミング版
 */
export default function RecordPage() {
  const router = useRouter();
  const { authenticated, user } = usePrivy();
  const [transcript, setTranscript] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "authenticated" | "error">("disconnected");
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  // Get user ID (prefer wallet address, fallback to Privy ID)
  const getUserId = useCallback(() => {
    const walletAddress = user?.wallet?.address;
    const privyId = user?.id;
    
    // Use wallet address if available (shorter and more standard)
    if (walletAddress) {
      console.log("👤 Using wallet address as user ID:", walletAddress);
      return walletAddress;
    }
    
    // Fallback to Privy ID but truncate if too long
    if (privyId) {
      const truncatedId = privyId.length > 42 ? privyId.substring(0, 42) : privyId;
      console.log("👤 Using truncated Privy ID as user ID:", truncatedId);
      return truncatedId;
    }
    
    console.warn("⚠️ No user ID available");
    return "";
  }, [user]);

  // リアルタイム音声ストリーミング用フック
  const {
    isStreaming,
    startStreaming,
    stopStreaming,
    hasPermission,
    requestPermission,
    volume,
  } = useRealtimeAudioStream({
    onAudioData: async (audioBlob: Blob) => {
      // WebSocketで音声データをリアルタイム送信
      if (websocketRef.current?.readyState === WebSocket.OPEN && connectionStatus === "authenticated") {
        try {
          await sendRealtimeAudioData(websocketRef.current, audioBlob);
        } catch (error) {
          console.error("❌ Failed to send audio data:", error);
        }
      }
    },
    onError: (error: Error) => {
      console.error("❌ Audio streaming error:", error);
      setTranscript(prev => prev + `\n❌ Audio error: ${error.message}`);
    },
    chunkInterval: 100, // Send 100ms chunks
  });

  // Generate UUID for WebSocket conversation
  const startNewConversation = useCallback(async () => {
    try {
      console.log("=== Generating UUID for WebSocket Conversation ===");
      const userId = getUserId();
      console.log("User ID:", userId);
      
      const conversationId = generateUUID();
      console.log("📋 Generated conversation ID:", conversationId);
      console.log("✅ UUID validation:", validateUUID(conversationId));
      console.log("🔗 WebSocket endpoint will be:", `${process.env.NEXT_PUBLIC_OTO_API_ENDPOINT}/conversation/${conversationId}/stream`);
      
      setConversationId(conversationId);
      return conversationId;
    } catch (error) {
      console.error("❌ Error generating conversation ID:", error);
      return null;
    }
  }, [getUserId]);

  // WebSocket接続を開始
  const connectWebSocket = useCallback(async (conversationId: string) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      console.log("⚠️ WebSocket already open, skipping connection");
      return;
    }

    if (!validateUUID(conversationId)) {
      console.error("❌ Cannot connect WebSocket: Invalid conversation ID format:", conversationId);
      setConnectionStatus("error");
      return;
    }

    const apiEndpoint = process.env.NEXT_PUBLIC_OTO_API_ENDPOINT || "";
    const apiKey = process.env.NEXT_PUBLIC_OTO_API_KEY || "";
    
    console.log("=== Establishing WebSocket Connection ===");
    console.log("📋 Conversation ID (UUID):", conversationId);
    console.log("✅ UUID validation passed");
    console.log("🔗 API Endpoint:", apiEndpoint);
    console.log("👤 User ID:", getUserId());
    
    try {
      setConnectionStatus("connecting");
      
      // Try different connection approaches (simplified - focus on message auth)
      const strategies = [
        // Strategy 1: Simple connection with message auth (this should work)
        () => {
          const baseUrl = apiEndpoint.replace('https', 'wss').replace('http', 'ws');
          const wsUrl = `${baseUrl}/conversation/${conversationId}/stream`;
          console.log("🧪 Trying simple connection with correct auth message format");
          return new WebSocket(wsUrl);
        },
        
        // Strategy 2: URL parameters as backup
        () => {
          const authParams = new URLSearchParams({
            authorization: apiKey.replace(/^Bearer\s+/i, '').trim(),
            user_id: getUserId()
          });
          const baseUrl = apiEndpoint.replace('https', 'wss').replace('http', 'ws');
          const wsUrl = `${baseUrl}/conversation/${conversationId}/stream?${authParams.toString()}`;
          console.log("🧪 Trying URL parameter authentication as backup");
          return new WebSocket(wsUrl);
        }
      ];

      let currentStrategy = 0;
      
      const tryConnection = () => {
        if (currentStrategy >= strategies.length) {
          console.error("❌ All WebSocket connection strategies failed");
          setConnectionStatus("error");
          return;
        }

        const ws = strategies[currentStrategy]();
        currentStrategy++;

        const connectionTimeout = setTimeout(() => {
          if (ws.readyState === WebSocket.CONNECTING) {
            console.warn("⏰ Connection timeout, trying next strategy...");
            ws.close();
            tryConnection();
          }
        }, 5000);

        ws.onopen = () => {
          clearTimeout(connectionTimeout);
          setConnectionStatus("connected");
          console.log("✅ WebSocket connected successfully");
          console.log("🔐 Sending authentication message");
          
          // Send authentication message with EXACT server format
          try {
            const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '').trim();
            const userId = getUserId();
            
            // Use the EXACT format the server expects
            const authMessage = {
              type: "auth",
              data: {
                userId: userId,
                apiKey: `Bearer ${cleanApiKey}`
              }
            };
            
            ws.send(JSON.stringify(authMessage));
            console.log('📤 Authentication message sent (correct format):', { type: 'auth', userId, apiKeyLength: cleanApiKey.length });
            
            // Set a timeout to assume authentication success if no response
            setTimeout(() => {
              if (ws.readyState === WebSocket.OPEN && connectionStatus === "connected") {
                setConnectionStatus("authenticated");
                console.log("✅ Assuming authentication successful (no explicit response)");
              }
            }, 2000);
          } catch (authError) {
            console.error('❌ Failed to send authentication message:', authError);
          }
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log("📨 Received WebSocket message:", message);
            
            // Check for authentication response first
            if (message.type === "auth" || message.type === "authentication") {
              if (message.success !== false && !message.error) {
                setConnectionStatus("authenticated");
                console.log("✅ WebSocket authentication successful");
              } else {
                console.error("❌ WebSocket authentication failed:", message);
                // Server explicitly rejected auth - don't retry with wrong format
                setConnectionStatus("error");
              }
              return;
            }
            
            switch (message.type) {
              case "transcribe":
                console.log("📝 Transcription update:", message.data?.transcript);
                setTranscript(prev => prev + (message.data?.transcript || ""));
                break;
              case "transcript-beautify":
                console.log("✨ Beautified transcript:", message.data?.transcript);
                setTranscript(message.data?.transcript || "");
                break;
              case "detect-action":
                console.log("🎯 Action detected:", message.data);
                break;
              case "error":
                console.error("🚨 Server error:", message);
                
                // Check if it's an authentication error
                if (message.message && message.message.includes("Authentication failed")) {
                  console.log("🔄 Trying correct auth format after error...");
                  try {
                    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '').trim();
                    const userId = getUserId();
                    
                    // Use the EXACT format the server expects
                    const correctAuthMessage = {
                      type: "auth",
                      data: {
                        userId: userId,
                        apiKey: cleanApiKey
                      }
                    };
                    ws.send(JSON.stringify(correctAuthMessage));
                    console.log('📤 Correct auth format sent after error');
                  } catch (authError) {
                    console.error('❌ Failed to send correct auth:', authError);
                    setConnectionStatus("error");
                  }
                } else {
                  setConnectionStatus("error");
                }
                break;
              default:
                console.log("❓ Unknown message type:", message.type, message);
                // If we get any successful response that's not an error, consider it authenticated
                if (connectionStatus === "connected") {
                  setConnectionStatus("authenticated");
                  console.log("✅ Assuming authentication successful based on server response");
                }
            }
          } catch (error) {
            console.error("❌ Failed to parse WebSocket message:", error);
          }
        };

        ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error(`❌ WebSocket error with strategy ${currentStrategy}:`, error);
          tryConnection(); // Try next strategy
        };

        ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log(`🔌 WebSocket disconnected with strategy ${currentStrategy}: code ${event.code}, reason: ${event.reason}`);
          
          if (event.code === 1006) {
            console.warn("⚠️ Code 1006: Abnormal closure - trying next strategy");
            tryConnection(); // Try next strategy
          } else if (event.code === 1008) {
            console.warn("⚠️ Code 1008: Policy violation - trying next strategy");
            tryConnection(); // Try next strategy
          } else {
            setConnectionStatus("disconnected");
          }
        };

        websocketRef.current = ws;
      };

      tryConnection();
      
    } catch (error) {
      console.error("❌ WebSocket connection failed:", error);
      setConnectionStatus("error");
    }
  }, [getUserId, connectionStatus]);

  // ボタンを押してWebSocket接続 + 音声ストリーミング開始
  const startRecording = useCallback(async () => {
    try {
      console.log("=== Starting Real-time Audio Streaming ===");
      
      // Step 1: Create new conversation
      const newConversationId = await startNewConversation();
      if (!newConversationId) {
        alert("Failed to create conversation");
        return;
      }

      console.log("✅ Conversation created:", newConversationId);

      // Step 2: Start WebSocket connection
      await connectWebSocket(newConversationId);

      // Step 3: Start real-time audio streaming
      console.log("🎤 Starting real-time audio streaming...");
      await startStreaming();
      
      setTranscript("🎤 Real-time audio streaming started - speaking to server...");
      
    } catch (error) {
      console.error("Failed to start streaming:", error);
      alert("Failed to start streaming. Please check microphone permissions.");
    }
  }, [startNewConversation, connectWebSocket, startStreaming]);

  // ボタンを押してWebSocket接続解除 + 音声ストリーミング停止
  const stopRecording = useCallback(async () => {
    console.log("=== Stopping Real-time Audio Streaming ===");
    
    try {
      // Step 1: Stop audio streaming
      console.log("🛑 Stopping audio streaming...");
      stopStreaming();

      // Step 2: Send completion signal via WebSocket
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        console.log("📤 Sending completion signal...");
        try {
          sendCompleteSignal(websocketRef.current);
          console.log("✅ Completion signal sent");
          
          // Wait for server to process completion, then close
          setTimeout(() => {
            if (websocketRef.current) {
              console.log("🔌 Closing WebSocket connection");
              websocketRef.current.close(1000, "Streaming completed");
              websocketRef.current = null;
            }
          }, 2000);
        } catch (error) {
          console.error("❌ Failed to send completion signal:", error);
        }
      } else {
        console.log("⚠️ WebSocket not connected, skipping completion signal");
      }
      
      setTranscript(prev => prev + "\n✅ Real-time streaming stopped");
      console.log("✅ Real-time streaming stopped successfully");
    } catch (error) {
      console.error("❌ Error during streaming stop:", error);
    }
  }, [stopStreaming]);

  // Monitor connection status for debugging
  useEffect(() => {
    console.log(`🔄 Connection status changed: ${connectionStatus}`);
  }, [connectionStatus]);

  // Monitor streaming status
  useEffect(() => {
    console.log(`🎤 Streaming status changed: ${isStreaming}`);
  }, [isStreaming]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (isStreaming) {
        stopStreaming();
      }
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [isStreaming, stopStreaming]);

  if (!authenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Real-time Voice Streaming · VAPI</title>
        <meta name="description" content="Real-time voice streaming to server" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Real-time Voice Streaming
            </h1>

            {/* Connection Status & Recording Info */}
            <div className="mb-6 p-4 rounded-lg bg-white/70 backdrop-blur-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Streaming Status:</span>
                  <span className={`text-sm font-bold flex items-center gap-1 ${
                    isStreaming ? "text-red-600" :
                    connectionStatus === "authenticated" ? "text-green-600" :
                    connectionStatus === "connected" ? "text-blue-600" :
                    connectionStatus === "connecting" ? "text-yellow-600" :
                    connectionStatus === "error" ? "text-orange-600" :
                    "text-gray-600"
                  }`}>
                    {isStreaming ? (
                      <>🔴 Streaming Active</>
                    ) : connectionStatus === "authenticated" ? (
                      <>✅ Ready to Stream</>
                    ) : connectionStatus === "connected" ? (
                      <>🔗 Authenticating...</>
                    ) : connectionStatus === "connecting" ? (
                      <>🔄 Connecting...</>
                    ) : connectionStatus === "error" ? (
                      <>⚠️ Connection Error</>
                    ) : (
                      <>⭕ Ready</>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">WebSocket:</span>
                  <span className={`text-xs font-medium ${
                    connectionStatus === "authenticated" ? "text-green-600" :
                    connectionStatus === "connected" ? "text-blue-600" :
                    connectionStatus === "connecting" ? "text-yellow-600" :
                    connectionStatus === "error" ? "text-red-600" :
                    "text-gray-600"
                  }`}>
                    {connectionStatus === "authenticated" ? "Real-time Streaming" :
                     connectionStatus === "connected" ? "Authenticating..." :
                     connectionStatus === "connecting" ? "Connecting..." :
                     connectionStatus === "error" ? "Connection Failed" :
                     "Standby"}
                  </span>
                </div>
                
                {conversationId && (
                  <div className="text-xs text-gray-500">
                    Conversation: {conversationId.substring(0, 8)}...
                  </div>
                )}
                
                {isStreaming && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600">
                      🎤 Real-time audio streaming to server
                    </span>
                    <div className="text-xs text-blue-600">
                      Volume: {Math.round(volume)}%
                    </div>
                  </div>
                )}
                
                {!hasPermission && (
                  <div className="text-xs text-orange-600">
                    ⚠️ Microphone permission required
                  </div>
                )}
              </div>
            </div>

            {/* Recording Controls */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 transition-all duration-300 ${
                isStreaming 
                  ? "bg-red-500 animate-pulse" 
                  : "bg-blue-500 hover:bg-blue-600"
              }`}>
                {isStreaming ? (
                  <MicOff size={32} className="text-white" />
                ) : (
                  <Mic size={32} className="text-white" />
                )}
              </div>

              <div className="space-y-3">
                {!isStreaming ? (
                  <Button
                    onClick={startRecording}
                    className="px-8 py-3 text-lg font-medium"
                    size="lg"
                    disabled={connectionStatus === "connecting"}
                  >
                    🎤 Start Streaming
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    className="px-8 py-3 text-lg font-medium"
                    size="lg"
                  >
                    <Square size={20} className="mr-2" />
                    Stop Streaming
                  </Button>
                )}
              </div>
            </div>

            {/* Transcription Display */}
            {transcript && (
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Real-time Transcription
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {transcript}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Real-time Voice Streaming
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Press "🎤 Start Streaming" to begin real-time audio streaming</li>
                <li>• Audio data is sent directly to the server via WebSocket</li>
                <li>• No file recording - pure real-time streaming</li>
                <li>• Live transcription and processing</li>
                <li>• Press "Stop Streaming" to end the connection</li>
                <li>• WebSocket connection automatically closes after stopping</li>
              </ul>
              <div className="mt-3 text-sm text-blue-600">
                ✨ Real-time audio streaming with Web Audio API for low latency
              </div>
            </div>
          </div>
        </div>
        <FooterNavigation />
      </div>
    </>
  );
}
