"use client";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { Mic, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * RecordPage Component
 * @returns
 */
export default function RecordPage() {
  // 録音状態を管理するstate
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 録音用のRef
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 録音開始処理
  const startRecording = async () => {
    try {
      // マイクへのアクセス許可を取得
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // MediaRecorderの初期化
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // データが利用可能になったときのイベントハンドラ
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 録音停止時のイベントハンドラ
      mediaRecorder.onstop = () => {
        // 録音データをBlobに変換
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioBlob(audioBlob);

        // ストリームのトラックを停止
        stream.getTracks().forEach((track) => track.stop());
      };

      // 録音開始
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // 録音時間を更新するタイマー
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("録音の開始に失敗しました:", error);
    }
  };

  // 録音停止処理
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // タイマーをクリア
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // 録音データを分析するAPI呼び出し
  const analyzeRecording = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);

    try {
      // FormDataの作成
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      console.log("audio data:", audioBlob);

      // APIエンドポイントに送信
      // ※ ここはバックエンドのAPIを呼び出すように想定
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // 分析成功
        console.log("録音の分析が完了しました");
        // 分析後の処理（例：会話履歴画面への遷移など）
      } else {
        throw new Error("分析に失敗しました");
      }
    } catch (error) {
      console.error("録音の分析中にエラーが発生しました:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // コンポーネントのアンマウント時にタイマーをクリア
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // 録音時間のフォーマット（mm:ss）
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-4">
      {/* 上部のロゴ/アイコン */}
      <div className="w-24 h-24 mb-8 mt-8 rounded-full bg-gradient-to-r from-green-200 to-yellow-200 flex items-center justify-center">
        <span className="text-4xl font-bold text-white">N</span>
      </div>

      {/* 録音コントロール */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {isRecording ? (
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full border-2"
            onClick={stopRecording}
          >
            <Square className="w-6 h-6" />
            <span className="sr-only">録音停止</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className={`w-12 h-12 rounded-full border-2 ${audioBlob ? "bg-green-100" : "bg-red-100"}`}
            onClick={startRecording}
          >
            <Mic className="w-6 h-6" />
            <span className="sr-only">録音開始</span>
          </Button>
        )}

        {isRecording && (
          <div className="px-4 py-2 bg-red-100 rounded-full flex items-center gap-2">
            <span className="animate-pulse">●</span>
            <span>{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      {/* 録音後の分析ボタン */}
      {audioBlob && !isRecording && (
        <Button className="mb-8" onClick={analyzeRecording} disabled={isAnalyzing}>
          {isAnalyzing ? "分析中..." : "分析する"}
        </Button>
      )}

      {/* 統計情報 */}
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
