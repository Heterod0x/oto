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
  sendCompleteSignal,
  WebSocketMessage,
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
    
    const ws = createAudioWebSocket(conversationId, user?.id || "", apiKey, apiEndpoint);

    ws.onopen = () => {
      setConnectionStatus("connected");
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log("Received message:", message);
        
        switch (message.type) {
          case "transcribe":
            setTranscript(prev => prev + (message.data.transcript || ""));
            break;
          case "transcript-beautify":
            setTranscript(message.data.transcript);
            break;
          case "detect-action":
            console.log("Action detected:", message.data);
            break;
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
    };

    ws.onclose = () => {
      setConnectionStatus("disconnected");
      console.log("WebSocket disconnected");
    };

    websocketRef.current = ws;
  }, [user?.id]);

  // 録音開始
  const startRecording = useCallback(async () => {
    try {
      // 新しい会話を作成
      const newConversationId = await startNewConversation();
      if (!newConversationId) {
        alert("Failed to create conversation");
        return;
      }

      // WebSocket接続
      connectWebSocket(newConversationId);

      // マイクアクセス許可取得
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      streamRef.current = stream;

      // MediaRecorder設定
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data.size > 0 && websocketRef.current?.readyState === WebSocket.OPEN) {
          try {
            const base64Data = await audioBlobToBase64(event.data);
            sendAudioData(websocketRef.current, base64Data);
          } catch (error) {
            console.error("Failed to send audio data:", error);
          }
        }
      };

      // 100ms間隔でデータを送信
      mediaRecorder.start(100);
      setIsRecording(true);
      setTranscript("");
      
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Failed to start recording. Please check microphone permissions.");
    }
  }, [startNewConversation, connectWebSocket]);

  // 録音停止
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // 会話完了をWebSocketで送信
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      sendCompleteSignal(websocketRef.current);
      
      setTimeout(() => {
        websocketRef.current?.close();
      }, 1000);
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
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Connection Status:</span>
                <span className={`text-sm font-bold ${
                  connectionStatus === "connected" ? "text-green-600" :
                  connectionStatus === "error" ? "text-red-600" :
                  "text-gray-600"
                }`}>
                  {connectionStatus === "connected" ? "Connected" :
                   connectionStatus === "error" ? "Error" : "Disconnected"}
                </span>
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
