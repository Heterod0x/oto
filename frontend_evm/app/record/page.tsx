"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { storeConversation } from "@/lib/api";
import { useAppKitAccount } from "@reown/appkit/react";
import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/**
 * RecordPage Component
 * @returns
 */
export default function RecordPage() {
  // State to manage recording status
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Maximum recording time (seconds)
  const MAX_RECORDING_TIME = 120; // 2 minutes

  // Recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // get wallet address
  const { address } = useAppKitAccount();

  // Start recording function
  const startRecording = async () => {
    try {
      // Get permission to access the microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Initialize MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Event handler for when data becomes available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Event handler for when recording stops
      mediaRecorder.onstop = () => {
        console.log("MediaRecorder stopped, creating Blob from chunks");
        // Convert recording data to Blob
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);

        // Stop tracks in the stream
        stream.getTracks().forEach((track) => track.stop());
      };

      // Start recording
      // Reduce the maximum size of chunks recorded at once for faster processing
      mediaRecorder.start(100); // Record data every 100ms
      setIsRecording(true);
      setAudioBlob(null); // 新しい録音を開始するときに前回のBlobをクリア
      setRecordingTime(0);

      // Timer to update recording time and check for max duration
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          
          // Stop recording when maximum recording time is reached
          if (newTime >= MAX_RECORDING_TIME) {
            // If data already exists, prepare the Blob ahead of time
            if (audioChunksRef.current.length > 0) {
              const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
              setAudioBlob(blob);
            }
            
            // Stop recording
            stopRecording();
            toast.info("Recording has been stopped as it reached 2 minutes");
            setIsRecording(false);
            
            // Run multiple processes to check if Blob is set
            const ensureAudioBlob = () => {
              if (audioChunksRef.current.length > 0) {
                console.log("Creating audio blob after max time reached");
                const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                setAudioBlob(blob);
              }
            };
            
            // 複数のタイミングで試行して確実に設定する
            setTimeout(ensureAudioBlob, 500);
            setTimeout(ensureAudioBlob, 1000);
            setTimeout(ensureAudioBlob, 2000);
          }
          
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Error starting recording");
    }
  };

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        // Fire dataavailable event before stopping to ensure data is captured
        if (mediaRecorderRef.current.state !== "inactive") {
          // Use MediaRecorder.requestData if supported
          if (typeof mediaRecorderRef.current.requestData === "function") {
            mediaRecorderRef.current.requestData();
          }
          // Stop recording
          mediaRecorderRef.current.stop();
        }
        
        setIsRecording(false);

        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }

        // Fallback process in case audioBlob is not set after recording stops
        // Use a longer delay to avoid timing issues
        setTimeout(() => {
          if (!audioBlob && audioChunksRef.current.length > 0) {
            console.log("Fallback: Creating audio blob from chunks");
            const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
            setAudioBlob(blob);
          }
        }, 1000);
      } catch (error) {
        console.error("Error stopping recording:", error);
      }
    }
  };

  // API call to analyze recording data
  const analyzeRecording = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      console.log("audio data:", audioBlob);

      // Convert recording data to File object
      const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" });
      // Call storeConversation API
      await storeConversation(address!, audioFile);

      console.log("Recording analysis completed");
      toast.success("Recording analysis completed");
    } catch (error) {
      console.error("Error analyzing recording:", error);
      toast.error("Error analyzing recording");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Clear timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format recording time (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-4 relative">
      {/* Loading overlay */}
      <LoadingOverlay
        isLoading={isAnalyzing}
        text="Analyzing audio..."
        fullScreen={false}
        className="rounded-xl"
      />

      {/* Top logo/icon */}
      <div className="w-24 h-24 mb-8 mt-8 rounded-full bg-gradient-to-r from-green-200 to-yellow-200 flex items-center justify-center">
        <img src="/icons/logo.jpeg" />
      </div>

      {/* Recording controls */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {isRecording ? (
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full border-2"
            onClick={stopRecording}
          >
            <Square className="w-6 h-6" />
            <span className="sr-only">Stop recording</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className={`w-12 h-12 rounded-full border-2 ${audioBlob ? "bg-green-100" : "bg-red-100"}`}
            onClick={startRecording}
          >
            <Mic className="w-6 h-6" />
            <span className="sr-only">Start recording</span>
          </Button>
        )}

        {isRecording && (
          <div className="px-4 py-2 bg-red-100 rounded-full flex items-center gap-2">
            <span className="animate-pulse">●</span>
            <span>{formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}</span>
          </div>
        )}
      </div>

      {/* Analyze button after recording */}
      {audioBlob && !isRecording && (
        <Button className="mb-8" onClick={analyzeRecording} disabled={isAnalyzing}>
          {isAnalyzing ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </Button>
      )}

      {/* Statistics */}
      <Card className="w-full max-w-md mb-8">
        <CardContent className="p-4">
          <h2 className="text-lg font-medium mb-2">Stats</h2>
          <Separator className="mb-4" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>This week</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Duration</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">18 h</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Tokens</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">21,000 tokens</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Earnings</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">210 $NVS</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
