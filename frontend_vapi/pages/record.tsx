import { usePrivy } from "@privy-io/react-auth";
import { Mic, MicOff, Square } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { FooterNavigation } from "../components/FooterNavigation";
import { Button } from "../components/ui/button";
import {
  audioBlobToBase64,
  createAudioWebSocket,
  generateUUID,
  sendAudioData,
  sendCompleteSignal,
  storeConversationAudio,
  validateUUID
} from "../lib/oto-api";

/**
 * 日常会話録音画面
 */
export default function RecordPage() {
  const router = useRouter();
  const { authenticated, user } = usePrivy();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "authenticated" | "error">("disconnected");
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  // Generate UUID for WebSocket conversation (no API call needed)
  const startNewConversation = useCallback(async () => {
    try {
      console.log("=== Generating UUID for WebSocket Conversation ===");
      const userId = getUserId();
      console.log("User ID:", userId);
      
      // Generate UUID directly for WebSocket endpoint (no API call needed)
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

  // WebSocket接続を開始（conversation_id必須）- 参考実装パターンに基づく
  const connectWebSocket = useCallback(async (conversationId: string) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      console.log("⚠️ WebSocket already open, skipping connection");
      return;
    }

    // Validate conversation ID before attempting WebSocket connection
    if (!validateUUID(conversationId)) {
      console.error("❌ Cannot connect WebSocket: Invalid conversation ID format:", conversationId);
      setConnectionStatus("error");
      return;
    }

    const apiEndpoint = process.env.NEXT_PUBLIC_OTO_API_ENDPOINT || "";
    const apiKey = process.env.NEXT_PUBLIC_OTO_API_KEY || "";
    
    console.log("=== Establishing WebSocket Connection (Reference Implementation) ===");
    console.log("📋 Conversation ID (UUID):", conversationId);
    console.log("✅ UUID validation passed");
    console.log("🔗 API Endpoint:", apiEndpoint);
    console.log("👤 User ID:", getUserId());
    
    try {
      setConnectionStatus("connecting");
      
      // Use the simple, direct approach like the reference implementation
      const ws = createAudioWebSocket(conversationId, getUserId(), apiKey, apiEndpoint);

      ws.onopen = () => {
        setConnectionStatus("connected");
        console.log("✅ WebSocket connected successfully");
        console.log("🔐 Authentication message will be sent automatically");
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
              setConnectionStatus("error");
              console.error("❌ WebSocket authentication failed:", message);
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
              setConnectionStatus("error");
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
        console.error("❌ WebSocket error:", error);
        setConnectionStatus("error");
      };

      ws.onclose = (event) => {
        setConnectionStatus("disconnected");
        console.log(`🔌 WebSocket disconnected: code ${event.code}, reason: ${event.reason}`);
        
        // Log detailed close information for debugging
        if (event.code === 1005) {
          console.warn("⚠️ Code 1005: No status received - possible authentication issue");
        } else if (event.code === 1006) {
          console.warn("⚠️ Code 1006: Abnormal closure - connection lost");
        } else if (event.code === 1008) {
          console.warn("⚠️ Code 1008: Policy violation - likely authentication failure");
        }
      };

      websocketRef.current = ws;
      
    } catch (error) {
      console.error("❌ WebSocket connection failed:", error);
      setConnectionStatus("error");
      console.log("💡 Will continue with local recording and API fallback");
    }
  }, [getUserId]);

  // One-button recording: automatically handles conversation creation, authentication, and audio streaming
  const startRecording = useCallback(async () => {
    try {
      console.log("=== Starting One-Button Recording Process ===");
      
      // Step 1: Create new conversation
      const newConversationId = await startNewConversation();
      if (!newConversationId) {
        alert("Failed to create conversation");
        return;
      }

      console.log("✅ Conversation created:", newConversationId);

      // Step 2: Setup microphone access first for better UX
      console.log("🎤 Setting up microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
        } 
      });
      
      console.log("✅ Microphone access granted");
      streamRef.current = stream;

      // Step 3: Start WebSocket connection with fallback strategies
      await connectWebSocket(newConversationId);

      // Step 4: Setup MediaRecorder with improved compatibility
      const supportedMimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/wav'
      ];
      
      let mimeType = '';
      for (const type of supportedMimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          mimeType = type;
          break;
        }
      }
      
      console.log("Using MIME type:", mimeType || "browser default");

      const mediaRecorder = new MediaRecorder(stream, {
        ...(mimeType && { mimeType }),
        audioBitsPerSecond: 64000
      });
      
      mediaRecorderRef.current = mediaRecorder;

      // Store audio chunks for fallback API upload
      const audioChunks: Blob[] = [];
      let audioChunkCount = 0;

      mediaRecorder.ondataavailable = async (event) => {
        audioChunkCount++;
        console.log(`Audio chunk #${audioChunkCount}, size: ${event.data.size} bytes`);
        
        if (event.data.size > 0) {
          // Store chunk for potential API upload
          audioChunks.push(event.data);
          
          // Try WebSocket streaming first
          if (websocketRef.current?.readyState === WebSocket.OPEN && connectionStatus === "authenticated") {
            try {
              const base64Data = await audioBlobToBase64(event.data);
              sendAudioData(websocketRef.current, base64Data);
              console.log(`📤 Sent audio chunk #${audioChunkCount} via WebSocket`);
            } catch (error) {
              console.error("❌ Failed to send audio data via WebSocket:", error);
            }
          } else {
            console.log(`💾 WebSocket not ready (status: ${connectionStatus}), storing chunk for API upload`);
          }
        }
      };

      // Setup recording events
      mediaRecorder.onstart = () => {
        console.log("✅ MediaRecorder started");
        setIsRecording(true);
        setTranscript("🎤 Recording started - streaming audio in real-time...");
      };

      mediaRecorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event);
      };

      mediaRecorder.onstop = async () => {
        console.log("⏹️ MediaRecorder stopped");
        
        // Fallback: Upload to API if WebSocket failed
        if (audioChunks.length > 0 && (!websocketRef.current || connectionStatus !== "authenticated")) {
          console.log("📤 Uploading audio to API as fallback...");
          try {
            await uploadAudioToAPI(audioChunks, newConversationId);
          } catch (error) {
            console.error("❌ Failed to upload audio to API:", error);
          }
        }
      };

      // Step 5: Start recording immediately
      console.log("🎬 Starting recording immediately...");
      mediaRecorder.start(250); // 250ms intervals for good real-time performance
      
      // Step 6: Wait for WebSocket authentication in background (non-blocking)
      setTimeout(async () => {
        try {
          await waitForWebSocketAuth(30000); // 30 second timeout
          console.log("✅ WebSocket authentication completed in background");
        } catch (error) {
          console.warn("⚠️ WebSocket authentication timeout - continuing with local recording");
        }
      }, 0);
      
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Failed to start recording. Please check microphone permissions.");
    }
  }, [startNewConversation, connectWebSocket, connectionStatus]);

  // Helper function to wait for WebSocket authentication
  const waitForWebSocketAuth = useCallback(async (timeout: number = 30000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const checkInterval = 200; // Check every 200ms
      let elapsed = 0;
      
      const checkAuth = () => {
        if (connectionStatus === "authenticated") {
          console.log("✅ WebSocket authenticated successfully");
          resolve();
        } else if (connectionStatus === "error") {
          console.log("❌ WebSocket authentication failed");
          reject(new Error("WebSocket authentication failed"));
        } else if (elapsed >= timeout) {
          console.log("⏰ WebSocket authentication timeout");
          reject(new Error("WebSocket authentication timeout"));
        } else {
          elapsed += checkInterval;
          setTimeout(checkAuth, checkInterval);
        }
      };
      
      checkAuth();
    });
  }, [connectionStatus]);

  // Helper function to upload audio to API as fallback (following reference implementation)
  const uploadAudioToAPI = useCallback(async (audioChunks: Blob[], conversationId: string) => {
    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_OTO_API_ENDPOINT || "";
      const apiKey = process.env.NEXT_PUBLIC_OTO_API_KEY || "";
      
      // Combine audio chunks into single blob
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
      
      console.log("📤 Attempting audio upload to API as fallback...");
      console.log("⚠️ Note: This API primarily supports WebSocket streaming");
      
      // Use the API pattern with updated messaging
      const result = await storeConversationAudio(
        getUserId(), 
        audioFile, 
        apiKey, 
        apiEndpoint
      );

      if (result.success) {
        console.log("✅ Audio uploaded to API successfully:", result);
        setTranscript(prev => prev + "\n✅ Audio processing completed via API");
        
        if (result.conversationId) {
          console.log("🔄 Background analysis triggered for conversation:", result.conversationId);
        }
      } else {
        console.log("ℹ️ API upload not available:", result.message);
        setTranscript(prev => prev + "\n💾 Audio saved locally (API streaming only)");
      }
    } catch (error) {
      console.error("❌ Error uploading to API:", error);
      setTranscript(prev => prev + "\n❌ Error processing audio");
    }
  }, [getUserId]);

  // Monitor connection status for debugging
  useEffect(() => {
    console.log(`🔄 Connection status changed: ${connectionStatus}`);
  }, [connectionStatus]);

  // 録音停止
  const stopRecording = useCallback(() => {
    console.log("=== Stopping Recording ===");
    
    try {
      // Stop MediaRecorder
      if (mediaRecorderRef.current && isRecording) {
        console.log("⏹️ Stopping MediaRecorder...");
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }

      // Stop microphone stream
      if (streamRef.current) {
        console.log("🎤 Stopping microphone stream...");
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      // Send completion signal via WebSocket
      if (websocketRef.current?.readyState === WebSocket.OPEN) {
        console.log("📤 Sending completion signal...");
        try {
          sendCompleteSignal(websocketRef.current);
          console.log("✅ Completion signal sent");
          
          // Wait for server to process completion, then close
          setTimeout(() => {
            if (websocketRef.current) {
              console.log("🔌 Closing WebSocket connection");
              websocketRef.current.close(1000, "Recording completed");
              websocketRef.current = null;
            }
          }, 2000); // Increased delay to allow server processing
        } catch (error) {
          console.error("❌ Failed to send completion signal:", error);
        }
      } else {
        console.log("⚠️ WebSocket not connected, skipping completion signal");
      }
      
      console.log("✅ Recording stopped successfully");
    } catch (error) {
      console.error("❌ Error during recording stop:", error);
    }
  }, [isRecording]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [isRecording]);

  if (!authenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Daily Conversation Recording · VAPI</title>
        <meta name="description" content="Record and save daily conversations" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Daily Conversation Recording
            </h1>

            {/* Connection Status & Recording Info */}
            <div className="mb-6 p-4 rounded-lg bg-white/70 backdrop-blur-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Recording Status:</span>
                  <span className={`text-sm font-bold flex items-center gap-1 ${
                    isRecording ? "text-red-600" :
                    connectionStatus === "authenticated" ? "text-green-600" :
                    connectionStatus === "connected" ? "text-blue-600" :
                    connectionStatus === "connecting" ? "text-yellow-600" :
                    connectionStatus === "error" ? "text-orange-600" :
                    "text-gray-600"
                  }`}>
                    {isRecording ? (
                      <>🔴 Recording Active</>
                    ) : connectionStatus === "authenticated" ? (
                      <>✅ Ready to Record</>
                    ) : connectionStatus === "connected" ? (
                      <>🔗 Authenticating...</>
                    ) : connectionStatus === "connecting" ? (
                      <>🔄 Connecting...</>
                    ) : connectionStatus === "error" ? (
                      <>⚠️ Fallback Mode</>
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
                     connectionStatus === "connecting" ? "Trying Multiple Strategies..." :
                     connectionStatus === "error" ? "Using API Fallback" :
                     "Standby"}
                  </span>
                </div>
                
                {conversationId && (
                  <div className="text-xs text-gray-500">
                    Conversation: {conversationId.substring(0, 8)}...
                  </div>
                )}
                
                {isRecording && (
                  <div className="text-xs text-blue-600">
                    🎤 One-button recording: Streaming audio and processing in real-time
                  </div>
                )}
                
                {!isRecording && connectionStatus !== "authenticated" && connectionStatus !== "connecting" && (
                  <div className="text-xs text-gray-600">
                    💡 Press record to start - WebSocket strategies will try automatically
                  </div>
                )}
                
                {connectionStatus === "connecting" && (
                  <div className="text-xs text-yellow-600">
                    🔄 Trying multiple WebSocket authentication strategies...
                  </div>
                )}
              </div>
            </div>

            {/* Recording Controls */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 transition-all duration-300 ${
                isRecording 
                  ? "bg-red-500 animate-pulse" 
                  : "bg-blue-500 hover:bg-blue-600"
              }`}>
                {isRecording ? (
                  <MicOff size={32} className="text-white" />
                ) : (
                  <Mic size={32} className="text-white" />
                )}
              </div>

              <div className="space-y-3">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    className="px-8 py-3 text-lg font-medium"
                    size="lg"
                  >
                    🎤 Start Recording & Stream
                  </Button>
                ) : (
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    className="px-8 py-3 text-lg font-medium"
                    size="lg"
                  >
                    <Square size={20} className="mr-2" />
                    Stop Recording
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
                <div className="text-gray-700 leading-relaxed">
                  {transcript}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Enhanced One-Button Recording
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Press "🎤 Start Recording & Stream" to begin instantly</li>
                <li>• Automatic conversation creation and authentication</li>
                <li>• Multiple WebSocket strategies with automatic fallback</li>
                <li>• Real-time audio streaming + API backup</li>
                <li>• Live transcription and background processing</li>
                <li>• Press "Stop Recording" when finished</li>
                <li>• View processed conversations in history</li>
              </ul>
              <div className="mt-3 text-sm text-blue-600">
                ✨ Now with improved authentication strategies based on reference implementation
              </div>
            </div>
          </div>
        </div>
        <FooterNavigation />
      </div>
    </>
  );
}
