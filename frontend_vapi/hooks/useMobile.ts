import { useEffect, useState } from 'react';

/**
 * モバイルデバイスを検出するフック
 */
export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // 初期チェック
    checkIsMobile();

    // リサイズイベントリスナー
    window.addEventListener('resize', checkIsMobile);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
}

/**
 * PWAインストール機能を提供するフック
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // デフォルトのインストールプロンプトを防ぐ
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return false;

    // インストールプロンプトを表示
    deferredPrompt.prompt();

    // ユーザーの選択を待つ
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
      return true;
    }

    return false;
  };

  return {
    isInstallable,
    installPWA
  };
}
