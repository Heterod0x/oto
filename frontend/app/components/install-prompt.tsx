"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  // PWAインストールプロンプトのイベントを保存
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  // プロンプトが表示可能かどうか
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // beforeinstallpromptイベントが発生したときに処理
    const handleBeforeInstallPrompt = (e: Event) => {
      // デフォルトのプロンプトを防止
      e.preventDefault();
      // イベントを保存
      setDeferredPrompt(e);
      // プロンプトを表示可能に
      setShowInstallPrompt(true);
    };

    // インストール済みかどうかをローカルストレージから確認
    const isInstalled = localStorage.getItem("pwaInstalled") === "true";
    
    if (!isInstalled) {
      // イベントリスナーを登録
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }

    return () => {
      // コンポーネントのクリーンアップ時にイベントリスナーを削除
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // インストールを実行する処理
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // インストールプロンプトを表示
    deferredPrompt.prompt();

    // ユーザーの選択を待つ
    const choiceResult = await deferredPrompt.userChoice;

    // 選択結果に応じた処理
    if (choiceResult.outcome === "accepted") {
      console.log("ユーザーがPWAのインストールを承認しました");
      localStorage.setItem("pwaInstalled", "true");
    } else {
      console.log("ユーザーがPWAのインストールを拒否しました");
    }

    // 使用済みのプロンプトをクリア
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  // バナーを閉じる処理
  const dismissPrompt = () => {
    setShowInstallPrompt(false);
    // 24時間表示しない設定を保存
    const now = new Date();
    localStorage.setItem("installPromptDismissed", now.toString());
  };

  // プロンプトが表示できない場合は何も表示しない
  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 mx-auto max-w-sm p-4 z-50">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="font-bold">アプリをインストール</h3>
          <button onClick={dismissPrompt} className="text-primary-foreground">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm my-2">
          ホーム画面に追加して、オフラインでも使用できるようにしましょう
        </p>
        <Button onClick={handleInstallClick} className="mt-2 w-full">
          インストール
        </Button>
      </div>
    </div>
  );
}