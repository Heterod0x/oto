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
 * エージェントとの対話画面コンポーネント
 * 音声録音とストリーミング機能を提供
 */
export function AgentChat({ className }: AgentChatProps) {
  const router = useRouter();
  
  // 状態管理
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 音声録音フック
  const {
    isRecording,
    startRecording,
    stopRecording,
    hasPermission,
    requestPermission,
    volume,
  } = useVoiceRecording({
    onStreamData: (audioBlob) => {
      // 音声データをWebSocket経由でストリーミング送信
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(audioBlob);
      }
    },
    onError: (error) => {
      setError(`録音エラー: ${error.message}`);
    },
  });

  /**
   * 音声セッション開始（デモモード対応）
   */
  const handleStartRecording = useCallback(async () => {
    try {
      setError(null);
      setIsConnecting(true);

      // デモモードの場合は実際の録音なしでシミュレート
      console.log('Demo mode: Starting voice session simulation');
      
      // 2秒後に録音状態をシミュレート
      setTimeout(() => {
        setIsConnecting(false);
        startRecording();
      }, 2000);

    } catch (error) {
      console.error('録音開始エラー:', error);
      setError(`録音開始に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
      setIsConnecting(false);
    }
  }, [startRecording]);

  /**
   * 音声セッション終了（デモモード対応）
   */
  const handleStopRecording = useCallback(async () => {
    try {
      // 録音停止
      stopRecording();

      // デモモード: 2秒後にタスク画面に遷移
      setTimeout(() => {
        router.push('/tasks');
      }, 1000);

    } catch (error) {
      console.error('録音停止エラー:', error);
      setError(`録音停止に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }, [stopRecording, router]);

  /**
   * キーボードイベントハンドラー（スペースバーで録音開始/停止）
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
   * コンポーネントアンマウント時のクリーンアップ
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

  // 音量インジケーターのスタイル
  const volumeStyle = {
    transform: `scale(${1 + volume / 100})`,
    opacity: isRecording ? 0.3 + (volume / 100) * 0.7 : 1,
  };

  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 p-6", className)}>
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          エージェントとの対話
        </h1>
        <p className="text-gray-600">
          マイクボタンを押して会話を開始してください
        </p>
      </div>

      {/* メインコントロールエリア */}
      <div className="relative mb-8">
        {/* 音量可視化リング */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-4 border-violet-300 animate-pulse" 
               style={volumeStyle} />
        )}
        
        {/* メイン録音ボタン */}
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
              ? "接続中です" 
              : isRecording 
                ? "録音を停止" 
                : "録音を開始"
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

      {/* ステータステキスト */}
      <div className="text-center mb-6">
        {isConnecting ? (
          <p className="text-violet-600 font-medium">接続中...</p>
        ) : isRecording ? (
          <div className="space-y-2">
            <p className="text-red-600 font-medium flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              録音中
            </p>
            <p className="text-sm text-gray-500">もう一度ボタンを押すと録音を停止します</p>
          </div>
        ) : (
          <p className="text-gray-600">ボタンを押して録音を開始</p>
        )}
      </div>

      {/* 音量レベル表示 */}
      {isRecording && (
        <div className="w-64 bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-violet-600 h-2 rounded-full transition-all duration-100"
            style={{ width: `${Math.min(100, volume)}%` }}
          />
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md text-center">
          <p className="text-sm">{error}</p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-red-600 hover:text-red-700"
            onClick={() => setError(null)}
          >
            閉じる
          </Button>
        </div>
      )}

      {/* ヘルプテキスト */}
      <div className="mt-12 text-center max-w-md">
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Volume2 size={16} />
            使い方
          </h3>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li>• マイクボタンまたはスペースキーで録音開始</li>
            <li>• エージェントと自然に会話</li>
            <li>• 再度ボタンを押して録音終了</li>
            <li>• 自動的にタスク画面に移動</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
