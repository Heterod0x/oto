import { Download, X } from 'lucide-react';
import React from 'react';
import { usePWAInstall } from '../hooks/useMobile';
import { Button } from './ui/button';

/**
 * Props for PWAInstallPrompt component
 */
interface PWAInstallPromptProps {
  /** Callback function to handle prompt close */
  onClose?: () => void;
}

/**
 * PWAInstallPrompt component that displays a prompt for users to install
 * the Progressive Web App (PWA) on their device
 *
 * @param props - Component props
 * @returns React component for PWA installation prompt
 */
export function PWAInstallPrompt({ onClose }: PWAInstallPromptProps) {
  const { isInstallable, installPWA } = usePWAInstall();
  const [isDismissed, setIsDismissed] = React.useState(false);

  /**
   * Handles the PWA installation process
   */
  const handleInstall = async () => {
    const success = await installPWA();
    if (success || onClose) {
      onClose?.();
    }
  };

  /**
   * Handles dismissing the install prompt
   */
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
          <h3 className="font-semibold text-gray-900 text-sm">Install App</h3>
          <p className="text-gray-600 text-xs mt-1">
            Add to home screen for quick access
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={handleInstall} className="text-xs">
              Install
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-xs"
            >
              Later
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
