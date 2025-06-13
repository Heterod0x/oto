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
  createConversation,
  sendAudioData,
  sendCompleteSignal
} from "../lib/oto-api";

/**
 * 日常会話録音画面
 */
export default function RecordPage() {
  const router = useRouter();
  const { authenticated, user } = usePrivy();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!authenticated) {
      router.push("/");
    }
  }, [authenticated, router]);

  // 新しい会話を開始する
  const startNewConversation = useCallback(async () => {
    try {
      const apiEndpoint = process.env.NEXT_PUBLIC_OTO_API_ENDPOINT || "";
      const apiKey = process.env.NEXT_PUBLIC_OTO_API_KEY || "";
      
      const conversation = await createConversation(
        `Daily Conversation ${new Date().toLocaleString("en-US")}`,
        user?.id || "",
        apiKey,
        apiEndpoint
      );
      
      if (conversation) {
        setConversationId(conversation.id);
        return conversation.id;
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
    return null;
  }, [user?.id]);

  // WebSocket接続を開始
  const connectWebSocket = useCallback((conversationId: string) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const apiEndpoint = process.env.NEXT_PUBLIC_OTO_API_ENDPOINT || "";
    const apiKey = process.env.NEXT_PUBLIC_OTO_API_KEY || "";
    
    console.log("=== Establishing WebSocket Connection ===");
    console.log("Conversation ID:", conversationId);
    console.log("API Endpoint:", apiEndpoint);
    console.log("User ID:", user?.id);
    
    const ws = createAudioWebSocket(conversationId, user?.id || "", apiKey, apiEndpoint);

    ws.onopen = () => {
      setConnectionStatus("connected");
      console.log("✅ WebSocket connected successfully");
      
      // Wait for connection to stabilize before sending auth
      setTimeout(() => {
        if (ws.readyState === WebSocket.OPEN) {
          console.log("🔐 Sending authentication after stabilization...");
          try {
            const authMessage = {
              type: 'auth',
              data: {
                userId: user?.id || "",
                apiKey: apiKey.replace(/^Bearer\s+/i, '').trim(),
                conversationId: conversationId,
                timestamp: Date.now()
              }
            };
            ws.send(JSON.stringify(authMessage));
            console.log("✅ Authentication sent successfully");
          } catch (error) {
            console.error("❌ Failed to send auth:", error);
            setConnectionStatus("error");
          }
        }
      }, 1500); // Wait 1.5 seconds for stability
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("📨 Received WebSocket message:", message);
        
        switch (message.type) {
          case "auth":
          case "authentication":
          case "auth_response":
            console.log("🔐 Authentication response:", message);
            // Check if authentication was successful
            if (message.data?.success !== false && message.data?.error == null) {
              setConnectionStatus("authenticated");
              console.log("✅ WebSocket authentication successful");
            } else {
              setConnectionStatus("error");
              console.error("❌ WebSocket authentication failed:", message);
            }
            break;
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
  }, [user?.id]);

  // 録音開始
  const startRecording = useCallback(async () => {
    try {
      console.log("=== Starting Recording Process ===");
      
      // 新しい会話を作成
      const newConversationId = await startNewConversation();
      if (!newConversationId) {
        alert("Failed to create conversation");
        return;
      }

      console.log("✅ Conversation created:", newConversationId);

      // WebSocket接続
      connectWebSocket(newConversationId);

      // Wait for WebSocket to be ready before starting audio
      console.log("⏳ Waiting for WebSocket connection...");
      await new Promise<void>((resolve, reject) => {
        const checkConnection = setInterval(() => {
          if (connectionStatus === "authenticated") {
            console.log("✅ WebSocket authenticated, proceeding with recording");
            clearInterval(checkConnection);
            resolve();
          } else if (connectionStatus === "error") {
            console.log("❌ WebSocket authentication failed");
            clearInterval(checkConnection);
            reject(new Error("WebSocket authentication failed"));
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkConnection);
          if (connectionStatus !== "authenticated") {
            console.log("⏰ WebSocket connection timeout - proceeding anyway");
            resolve(); // Continue even if WebSocket isn't ready
          }
        }, 10000);
      });

      console.log("🎤 Starting microphone access...");

      // マイクアクセス許可取得
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

      // MediaRecorder設定 - より安定した設定を使用
      const supportedMimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus'
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

      let audioChunkCount = 0;

      mediaRecorder.ondataavailable = async (event) => {
        audioChunkCount++;
        console.log(`Audio chunk #${audioChunkCount}, size: ${event.data.size} bytes`);
        
        if (event.data.size > 0) {
          // Check WebSocket connection status
          if (websocketRef.current?.readyState === WebSocket.OPEN && connectionStatus === "authenticated") {
            try {
              const base64Data = await audioBlobToBase64(event.data);
              sendAudioData(websocketRef.current, base64Data);
              console.log(`📤 Sent audio chunk #${audioChunkCount} via WebSocket`);
            } catch (error) {
              console.error("❌ Failed to send audio data:", error);
            }
          } else if (websocketRef.current?.readyState === WebSocket.OPEN) {
            console.warn(`⚠️ WebSocket connected but not authenticated (status: ${connectionStatus}), audio chunk discarded`);
          } else {
            console.warn("⚠️ WebSocket not connected, audio chunk discarded");
          }
        }
      };

      // Set up recording events
      mediaRecorder.onstart = () => {
        console.log("✅ MediaRecorder started");
        setIsRecording(true);
        setTranscript("🎤 Recording started - streaming audio in real-time...");
      };

      mediaRecorder.onerror = (event) => {
        console.error("❌ MediaRecorder error:", event);
      };

      mediaRecorder.onstop = () => {
        console.log("⏹️ MediaRecorder stopped");
      };

      // Start recording with larger intervals to reduce server load
      console.log("🎬 Starting MediaRecorder...");
      mediaRecorder.start(250); // 250ms intervals instead of 100ms
      
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Failed to start recording. Please check microphone permissions.");
    }
  }, [startNewConversation, connectWebSocket, connectionStatus]);

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

            {/* Connection Status */}
            <div className="mb-6 p-4 rounded-lg bg-white/70 backdrop-blur-sm">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">WebSocket Status:</span>
                  <span className={`text-sm font-bold flex items-center gap-1 ${
                    connectionStatus === "connected" ? "text-blue-600" :
                    connectionStatus === "authenticated" ? "text-green-600" :
                    connectionStatus === "error" ? "text-red-600" :
                    "text-gray-600"
                  }`}>
                    {connectionStatus === "connected" ? (
                      <>🔗 Connected</>
                    ) : connectionStatus === "authenticated" ? (
                      <>✅ Authenticated</>
                    ) : connectionStatus === "error" ? (
                      <>❌ Error</>
                    ) : (
                      <>⭕ Disconnected</>
                    )}
                  </span>
                </div>
                
                {conversationId && (
                  <div className="text-xs text-gray-500">
                    Conversation: {conversationId.substring(0, 8)}...
                  </div>
                )}
                
                {connectionStatus === "authenticated" && (
                  <div className="text-xs text-green-600">
                    🎤 Ready for real-time audio streaming
                  </div>
                )}
                
                {connectionStatus === "error" && (
                  <div className="text-xs text-red-600">
                    ⚠️ Connection issue - recording will work locally
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
                    Start Recording
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
                How to Use
              </h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Press "Start Recording" to begin recording daily conversations</li>
                <li>• Spoken content will be transcribed in real-time</li>
                <li>• Press "Stop Recording" when you're done</li>
                <li>• Recorded conversations can be viewed in the history screen</li>
              </ul>
            </div>
          </div>
        </div>
        <FooterNavigation />
      </div>
    </>
  );
}
