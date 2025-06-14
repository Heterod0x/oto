import { usePrivy } from "@privy-io/react-auth";
import { Mic, Square } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FooterNavigation } from "../components/FooterNavigation";
import { Button } from "../components/ui/button";
import { useRealtimeAudioStream } from "../hooks/useRealtimeAudioStream";
import {
  generateUUID,
  getAudioStats,
  resetAudioStats,
  sendCompleteSignal,
  sendRealtimeAudioData,
  validateUUID,
} from "../lib/oto-api";

/**
 * 日常会話録音画面 - リアルタイム音声ストリーミング版
 */
export default function RecordPage() {
  const router = useRouter();
  const { authenticated, user } = usePrivy();
  const [transcript, setTranscript] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected" | "authenticated" | "error"
  >("disconnected");
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Audio streaming statistics
  const [audioStats, setAudioStats] = useState({
    totalChunks: 0,
    totalBytes: 0,
    averageChunkSize: 0,
    lastChunkTime: null as Date | null,
  });

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
  const { isStreaming, startStreaming, stopStreaming, hasPermission, requestPermission, volume } =
    useRealtimeAudioStream({
      onAudioData: async (audioBlob: Blob) => {
        // Check WebSocket state directly (not React state due to async updates)
        const wsState = websocketRef.current?.readyState;

        if (wsState === WebSocket.OPEN) {
          try {
            console.log(
              `🎤 Sending audio chunk (${audioBlob.size} bytes) - WebSocket state: ${wsState}`,
            );
            await sendRealtimeAudioData(websocketRef.current, audioBlob);
          } catch (error) {
            console.error("❌ Failed to send audio data:", error);
          }
        } else {
          // Only log every 10th skipped chunk to reduce console spam
          if (Math.random() < 0.1) {
            console.warn(`⚠️ WebSocket not ready, skipping chunk:`, {
              websocketState: wsState,
              wsStateText:
                wsState === 0
                  ? "CONNECTING"
                  : wsState === 1
                    ? "OPEN"
                    : wsState === 2
                      ? "CLOSING"
                      : wsState === 3
                        ? "CLOSED"
                        : "UNKNOWN",
              chunkSize: audioBlob.size,
            });
          }
        }
      },
      onError: (error: Error) => {
        console.error("❌ Audio streaming error:", error);
        setTranscript((prev) => prev + `\n❌ Audio error: ${error.message}`);
      },
      chunkInterval: 100, // Send 100ms chunks
    });

  // Update stats from global counter every second
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const globalStats = getAudioStats();
      setAudioStats({
        totalChunks: globalStats.totalChunks,
        totalBytes: globalStats.totalBytes,
        averageChunkSize: globalStats.avgChunkSize,
        lastChunkTime: globalStats.totalChunks > 0 ? new Date() : null,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Generate UUID for WebSocket conversation
  const startNewConversation = useCallback(async () => {
    try {
      console.log("=== Generating UUID for WebSocket Conversation ===");
      const userId = getUserId();
      console.log("User ID:", userId);

      const conversationId = generateUUID();
      console.log("📋 Generated conversation ID:", conversationId);
      console.log("✅ UUID validation:", validateUUID(conversationId));
      console.log(
        "🔗 WebSocket endpoint will be:",
        `${process.env.NEXT_PUBLIC_OTO_API_ENDPOINT}/conversation/${conversationId}/stream`,
      );

      setConversationId(conversationId);
      return conversationId;
    } catch (error) {
      console.error("❌ Error generating conversation ID:", error);
      return null;
    }
  }, [getUserId]);

  // WebSocket接続を開始（再利用可能なシングルトン方式）
  const connectWebSocket = useCallback(
    async (conversationId: string) => {
      // 既存のWebSocket接続をチェック
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        console.log("✅ WebSocket already connected and ready, reusing existing connection");
        // Mark as authenticated for existing connections
        (websocketRef.current as any).isAuthenticated = true;
        setConnectionStatus("authenticated");
        return;
      }

      // Connecting状態の接続もスキップ
      if (websocketRef.current?.readyState === WebSocket.CONNECTING) {
        console.log("⏳ WebSocket already connecting, waiting for completion");
        return;
      }

      // 古い接続をクリーンアップ
      if (websocketRef.current) {
        console.log("🧹 Cleaning up old WebSocket connection");
        websocketRef.current.close();
        websocketRef.current = null;
      }

      if (!validateUUID(conversationId)) {
        console.error(
          "❌ Cannot connect WebSocket: Invalid conversation ID format:",
          conversationId,
        );
        setConnectionStatus("error");
        return;
      }

      const apiEndpoint = process.env.NEXT_PUBLIC_OTO_API_ENDPOINT || "";
      const apiKey = process.env.NEXT_PUBLIC_OTO_API_KEY || "";

      console.log("=== Establishing NEW WebSocket Connection ===");
      console.log("📋 Conversation ID (UUID):", conversationId);
      console.log("🔗 API Endpoint:", apiEndpoint);
      console.log("👤 User ID:", getUserId());

      try {
        setConnectionStatus("connecting");

        // Use simple WebSocket URL without auth parameters (following reference implementation)
        const baseUrl = apiEndpoint.replace("https", "wss").replace("http", "ws");
        const wsUrl = `${baseUrl}/conversation/${conversationId}/stream`;
        console.log("🔗 Attempting connection (reference style):", wsUrl);

        const ws = new WebSocket(wsUrl);

        // Add authentication status tracking directly to WebSocket object
        (ws as any).isAuthenticated = false;

        const connectionTimeout = setTimeout(() => {
          if (ws.readyState === WebSocket.CONNECTING) {
            console.warn("⏰ Connection timeout");
            ws.close();
            setConnectionStatus("error");
          }
        }, 10000);

        ws.onopen = () => {
          clearTimeout(connectionTimeout);
          setConnectionStatus("connected");
          console.log("✅ WebSocket connected successfully");
          console.log("🔍 WebSocket details:", {
            readyState: ws.readyState,
            url: ws.url,
            protocol: ws.protocol,
            extensions: ws.extensions,
          });

          // Send authentication message immediately (following reference implementation)
          try {
            const cleanApiKey = apiKey.replace(/^Bearer\s+/i, "").trim();
            const userId = getUserId();

            console.log("🔐 Sending authentication message (reference format)");

            // Use exact format from reference implementation (keeping Bearer prefix)
            const authMessage = {
              type: "auth",
              data: {
                userId: userId,
                apiKey: `Bearer ${cleanApiKey}`, // Keep Bearer prefix as currently implemented
              },
            };

            ws.send(JSON.stringify(authMessage));
            console.log("📤 Authentication message sent:", JSON.stringify(authMessage));
          } catch (authError) {
            console.error("❌ Failed to send authentication message:", authError);
            setConnectionStatus("error");
          }
        };

        ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log("📨 WebSocket message:", message.type, message);

            switch (message.type) {
              case "auth":
                // Authentication response - check for specific success indicators
                console.log("🔐 Auth response received:", message);
                if (!message.error && message.data?.success !== false) {
                  // Mark as authenticated directly on WebSocket object
                  (ws as any).isAuthenticated = true;
                  setConnectionStatus("authenticated");
                  console.log("✅ Authentication successful via auth response");
                  console.log("🔍 WebSocket state after auth:", {
                    readyState: ws.readyState,
                    url: ws.url,
                    protocol: ws.protocol,
                  });
                } else {
                  console.error("❌ Authentication failed:", message.error || message.data);
                  setConnectionStatus("error");
                  // Close connection if auth failed
                  ws.close(1008, "Authentication failed");
                }
                break;
              case "transcribe":
                console.log("📝 Transcription:", message.data?.transcript);
                if (message.data?.transcript) {
                  setTranscript((prev) => prev + message.data.transcript);
                }
                break;
              case "transcript-beautify":
                console.log("✨ Beautified transcript:", message.data?.transcript);
                if (message.data?.transcript) {
                  setTranscript(message.data.transcript);
                }
                break;
              case "detect-action":
                console.log("🎯 Action detected:", message.data);
                break;
              case "error":
                console.error("🚨 Server error:", message);
                setConnectionStatus("error");
                break;
              default:
                console.log("❓ Unknown message type:", message.type, message);
            }
          } catch (error) {
            console.error("❌ Failed to parse WebSocket message:", error);
          }
        };

        ws.onerror = (error) => {
          clearTimeout(connectionTimeout);
          console.error("❌ WebSocket ERROR event:", {
            error: error,
            readyState: ws.readyState,
            url: ws.url,
            timestamp: new Date().toISOString(),
          });

          // Try to get more error details
          if (error instanceof Event) {
            console.error("🔍 Error event details:", {
              type: error.type,
              target: error.target,
              currentTarget: error.currentTarget,
              bubbles: error.bubbles,
              cancelable: error.cancelable,
            });
          }

          setConnectionStatus("error");
        };

        ws.onclose = (event) => {
          clearTimeout(connectionTimeout);
          console.log(`🔌 WebSocket CLOSED event details:`, {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean,
            timestamp: new Date().toISOString(),
            connectionDuration: Date.now() - performance.now(),
          });

          // Log previous connection status before closing
          console.log("📊 Connection status before close:", connectionStatus);

          // Detailed close code analysis
          const closeCodeMeanings = {
            1000: "Normal closure (server or client initiated)",
            1001: "Going away (page unload or server shutdown)",
            1002: "Protocol error (malformed frame or unsupported operation)",
            1003: "Unsupported data type (binary when text expected)",
            1005: "No status code (abnormal)",
            1006: "Abnormal closure (connection lost)",
            1007: "Invalid frame payload data (non-UTF8 in text frame)",
            1008: "Policy violation (authentication failure)",
            1009: "Message too big",
            1010: "Extension expected by client not returned by server",
            1011: "Unexpected condition prevented server from fulfilling request",
            1015: "TLS handshake failure",
          };

          const meaning = closeCodeMeanings[event.code] || "Unknown close code";
          console.log(`🔍 Close code ${event.code}: ${meaning}`);

          if (event.code === 1008) {
            console.error("🚨 Authentication failure detected - check API key and user ID");
          } else if (event.code === 1006) {
            console.error("🚨 Connection lost abnormally - possible network or server issue");
          } else if (event.code === 1002) {
            console.error("🚨 Protocol error - check message format");
          }

          setConnectionStatus("disconnected");

          // If we were streaming when the connection closed, stop streaming
          if (isStreaming) {
            console.log("🛑 WebSocket closed during streaming, stopping audio stream...");
            stopStreaming().catch((error) => {
              console.error("❌ Failed to stop streaming after WebSocket close:", error);
            });
          }

          // Only clear conversation ID if it was a permanent closure
          if (event.code !== 1000) {
            console.log("🔄 Connection lost, keeping conversation ID for potential reconnection");
          } else {
            setConversationId(null);
          }
        };

        websocketRef.current = ws;
      } catch (error) {
        console.error("❌ WebSocket connection failed:", error);
        setConnectionStatus("error");
      }
    },
    [getUserId],
  );

  /**
   * ボタンを押してWebSocket接続 + 音声ストリーミング開始
   */
  const startRecording = useCallback(async () => {
    try {
      console.log("=== Starting Real-time Audio Streaming ===");

      // Reset audio statistics for new session
      resetAudioStats();
      setAudioStats({
        totalChunks: 0,
        totalBytes: 0,
        averageChunkSize: 0,
        lastChunkTime: null,
      });

      let currentConversationId = conversationId;

      // Step 1: WebSocket接続をチェック、必要な場合のみ新規作成
      if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
        console.log("🔄 No active WebSocket connection, creating new conversation and connection");

        // Create new conversation only if we don't have an active connection
        const newConversationId = await startNewConversation();
        if (!newConversationId) {
          alert("Failed to create conversation");
          return;
        }
        currentConversationId = newConversationId;
        console.log("✅ New conversation created:", newConversationId);

        // Start WebSocket connection
        await connectWebSocket(newConversationId);
      } else {
        console.log("♻️ Reusing existing WebSocket connection");
        console.log("📋 Current conversation ID:", currentConversationId);

        // Ensure existing connection is marked as authenticated
        if (websocketRef.current?.readyState === WebSocket.OPEN) {
          (websocketRef.current as any).isAuthenticated = true;
          if (connectionStatus !== "authenticated") {
            console.log("🔄 WebSocket connected but not authenticated, updating status...");
            setConnectionStatus("authenticated");
          }
        }
      }

      // Step 2: Wait for WebSocket to be ready AND properly authenticated (direct check)
      let retries = 0;
      const maxRetries = 50; // 5 seconds total (100ms * 50)
      let isAuthenticated = false;

      console.log("⏳ Waiting for WebSocket to be ready and authenticated (direct check)...");

      while (retries < maxRetries) {
        const wsState = websocketRef.current?.readyState;
        const wsAuthenticated = (websocketRef.current as any)?.isAuthenticated;

        // Check WebSocket state AND direct authentication flag
        if (wsState === WebSocket.OPEN && wsAuthenticated === true) {
          console.log(
            `✅ WebSocket ready and authenticated after ${retries * 100}ms - wsState: ${wsState}, authenticated: ${wsAuthenticated}`,
          );
          isAuthenticated = true;
          break;
        }

        // If WebSocket is closing or closed, stop waiting
        if (wsState === WebSocket.CLOSING || wsState === WebSocket.CLOSED) {
          console.error(`❌ WebSocket connection lost during wait - wsState: ${wsState}`);
          alert("WebSocket connection lost. Please try again.");
          return;
        }

        // Log every 10 retries for debugging
        if (retries % 10 === 0) {
          console.log(
            `⏳ Waiting... retry ${retries}/${maxRetries} - wsState: ${wsState}, authenticated: ${wsAuthenticated}, reactState: ${connectionStatus}`,
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
        retries++;
      }

      // Final check - ensure both WebSocket state and direct authentication
      const finalWsState = websocketRef.current?.readyState;
      const finalAuthenticated = (websocketRef.current as any)?.isAuthenticated;

      if (finalWsState === WebSocket.OPEN && finalAuthenticated === true) {
        console.log("✅ WebSocket is OPEN and authenticated, proceeding with audio streaming");
        console.log(
          `📊 Final state - WebSocket: ${finalWsState}, Authenticated: ${finalAuthenticated}, ReactState: ${connectionStatus}`,
        );

        // Additional safety wait after authentication before starting audio
        console.log("⏱️ Additional safety wait (500ms) after authentication...");
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        console.error(`❌ WebSocket not ready or not authenticated after ${maxRetries * 100}ms`);
        console.error(
          `📊 Final state - WebSocket: ${finalWsState}, Authenticated: ${finalAuthenticated}, ReactState: ${connectionStatus}`,
        );
        alert("WebSocket connection or authentication failed. Please try again.");
        return;
      }

      // Step 3: Start real-time audio streaming
      console.log("🎤 Starting real-time audio streaming...");
      await startStreaming();

      setTranscript("🎤 Real-time audio streaming started - speaking to server...");
    } catch (error) {
      console.error("Failed to start streaming:", error);
      alert("Failed to start streaming. Please check microphone permissions.");
    }
  }, [conversationId, startNewConversation, connectWebSocket, startStreaming]);

  // ボタンを押してWebSocket接続解除 + 音声ストリーミング停止
  const stopRecording = useCallback(async () => {
    console.log("=== Stopping Real-time Audio Streaming ===");

    try {
      // Step 1: Stop audio streaming first
      console.log("🛑 Stopping audio streaming...");
      await stopStreaming();

      // Step 2: Send completion signal via WebSocket but keep connection open
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        console.log("📤 Sending completion signal...");
        try {
          sendCompleteSignal(websocketRef.current);
          console.log("✅ Completion signal sent");

          // DON'T close WebSocket - keep it open for reuse
          console.log("♻️ Keeping WebSocket connection open for reuse");
        } catch (error) {
          console.error("❌ Failed to send completion signal:", error);
        }
      } else {
        console.log("⚠️ WebSocket not connected, skipping completion signal");
      }

      setTranscript((prev) => prev + "\n✅ Real-time streaming stopped (connection preserved)");
      console.log("✅ Real-time streaming stopped successfully, WebSocket preserved");
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
                  <span
                    className={`text-sm font-bold flex items-center gap-1 ${
                      isStreaming
                        ? "text-red-600"
                        : connectionStatus === "authenticated"
                          ? "text-green-600"
                          : connectionStatus === "connected"
                            ? "text-blue-600"
                            : connectionStatus === "connecting"
                              ? "text-yellow-600"
                              : connectionStatus === "error"
                                ? "text-orange-600"
                                : "text-gray-600"
                    }`}
                  >
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
                  <span
                    className={`text-xs font-medium ${
                      connectionStatus === "authenticated"
                        ? "text-green-600"
                        : connectionStatus === "connected"
                          ? "text-blue-600"
                          : connectionStatus === "connecting"
                            ? "text-yellow-600"
                            : connectionStatus === "error"
                              ? "text-red-600"
                              : "text-gray-600"
                    }`}
                  >
                    {connectionStatus === "authenticated"
                      ? "Real-time Streaming"
                      : connectionStatus === "connected"
                        ? "Authenticating..."
                        : connectionStatus === "connecting"
                          ? "Connecting..."
                          : connectionStatus === "error"
                            ? "Connection Failed"
                            : "Standby"}
                  </span>
                </div>

                {conversationId && (
                  <div className="text-xs text-gray-500">
                    Conversation: {conversationId.substring(0, 8)}...
                  </div>
                )}

                {isStreaming && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600">
                        🎤 Real-time audio streaming to server
                      </span>
                      <div className="text-xs text-blue-600">Volume: {Math.round(volume)}%</div>
                    </div>

                    {/* Audio Statistics */}
                    {audioStats.totalChunks > 0 && (
                      <div className="text-xs text-gray-600 space-y-1 bg-gray-50 p-2 rounded">
                        <div className="font-semibold text-blue-700">
                          📊 Audio Streaming Statistics
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>Chunks: {audioStats.totalChunks}</div>
                          <div>Data: {Math.round(audioStats.totalBytes / 1024)}KB</div>
                          <div>Avg Size: {audioStats.averageChunkSize}B</div>
                          <div>
                            Last:{" "}
                            {audioStats.lastChunkTime
                              ? `${Math.round((Date.now() - audioStats.lastChunkTime.getTime()) / 1000)}s ago`
                              : "Never"}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!hasPermission && (
                  <div className="text-xs text-orange-600">⚠️ Microphone permission required</div>
                )}
              </div>
            </div>

            {/* Recording Controls */}
            <div className="text-center mb-8">
              {/* Large Microphone Button - Click to Start/Stop */}
              <div className="relative">
                <button
                  onClick={isStreaming ? stopRecording : startRecording}
                  disabled={connectionStatus === "connecting"}
                  className={`inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                    isStreaming
                      ? "bg-red-500 hover:bg-red-600 animate-pulse focus:ring-red-300"
                      : connectionStatus === "authenticated"
                        ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
                        : connectionStatus === "connecting"
                          ? "bg-yellow-500 cursor-not-allowed focus:ring-yellow-300"
                          : "bg-gray-400 hover:bg-gray-500 focus:ring-gray-300"
                  } ${connectionStatus === "connecting" ? "opacity-50" : ""}`}
                  title={isStreaming ? "Stop Streaming" : "Start Streaming"}
                >
                  {isStreaming ? (
                    <Square size={40} className="text-white" />
                  ) : (
                    <Mic size={40} className="text-white" />
                  )}
                </button>

                {/* Volume Ring Indicator */}
                {isStreaming && volume > 0 && (
                  <div
                    className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping"
                    style={{
                      opacity: Math.min(volume / 50, 1),
                      animationDuration: `${Math.max(0.5, 2 - volume / 50)}s`,
                    }}
                  />
                )}
              </div>

              {/* Status Text */}
              <div className="space-y-2">
                <div
                  className={`text-lg font-semibold ${
                    isStreaming
                      ? "text-red-600"
                      : connectionStatus === "authenticated"
                        ? "text-blue-600"
                        : connectionStatus === "connecting"
                          ? "text-yellow-600"
                          : "text-gray-600"
                  }`}
                >
                  {isStreaming
                    ? "🔴 Streaming Active"
                    : connectionStatus === "authenticated"
                      ? "🎤 Ready to Stream"
                      : connectionStatus === "connecting"
                        ? "🔄 Connecting..."
                        : connectionStatus === "error"
                          ? "⚠️ Connection Error"
                          : "⭕ Click to Start"}
                </div>

                <div className="text-sm text-gray-500">
                  {isStreaming
                    ? "Click the microphone to stop streaming"
                    : connectionStatus === "authenticated"
                      ? "Click the microphone to start streaming"
                      : connectionStatus === "connecting"
                        ? "Please wait..."
                        : "Click the microphone to begin"}
                </div>

                {/* Backup Text Buttons for Alternative Control */}
                <div className="mt-4 space-x-3">
                  {!isStreaming ? (
                    <Button
                      onClick={startRecording}
                      className="px-6 py-2 text-sm"
                      size="sm"
                      disabled={connectionStatus === "connecting"}
                      variant="outline"
                    >
                      🎤 Start Streaming
                    </Button>
                  ) : (
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="px-6 py-2 text-sm"
                      size="sm"
                    >
                      <Square size={16} className="mr-1" />
                      Stop Streaming
                    </Button>
                  )}
                </div>
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
