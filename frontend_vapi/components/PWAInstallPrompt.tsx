import { Download, X } from 'lucide-react';
import React from 'react';
import { usePWAInstall } from '../hooks/useMobile';
import { Button } from './ui/button';

interface PWAInstallPromptProps {
  onClose?: () => void;
}

export function PWAInstallPrompt({ onClose }: PWAInstallPromptProps) {
  const { isInstallable, installPWA } = usePWAInstall();
  const [isDismissed, setIsDismissed] = React.useState(false);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success || onClose) {
      onClose?.();
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    onClose?.();
  };

  if (!isInstallable || isDismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-40 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="bg-violet-100 p-2 rounded-lg">
          <Download className="h-5 w-5 text-violet-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm">
            アプリをインストール
          </h3>
          <p className="text-gray-600 text-xs mt-1">
            ホーム画面に追加してすぐにアクセス
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={handleInstall}
              className="text-xs"
            >
              インストール
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-xs"
            >
              後で
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
