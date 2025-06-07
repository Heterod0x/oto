import { Battery, BatteryLow, Signal, Wifi, WifiOff } from 'lucide-react';
import { useBatteryStatus, useNetworkStatus } from '../hooks/usePerformance';
import { cn } from '../lib/utils';

interface SystemStatusProps {
  className?: string;
  showInDevelopment?: boolean;
}

export function SystemStatus({ className, showInDevelopment = true }: SystemStatusProps) {
  const { isOnline, connectionType } = useNetworkStatus();
  const batteryInfo = useBatteryStatus();

  // Don't display in production (when showInDevelopment is false)
  if (process.env.NODE_ENV === 'production' && !showInDevelopment) {
    return null;
  }

  return (
    <div className={cn(
      "fixed top-4 left-4 z-50 bg-black/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm",
      "flex items-center gap-3",
      className
    )}>
      {/* Network status */}
      <div className="flex items-center gap-1">
        {isOnline ? (
          <Wifi className="h-3 w-3 text-green-400" />
        ) : (
          <WifiOff className="h-3 w-3 text-red-400" />
        )}
        <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
          {isOnline ? connectionType : 'Offline'}
        </span>
      </div>

      {/* Battery status */}
      {batteryInfo && (
        <div className="flex items-center gap-1">
          {batteryInfo.level < 0.2 ? (
            <BatteryLow className="h-3 w-3 text-red-400" />
          ) : (
            <Battery className="h-3 w-3 text-green-400" />
          )}
          <span className={batteryInfo.level < 0.2 ? 'text-red-400' : 'text-green-400'}>
            {Math.round(batteryInfo.level * 100)}%
            {batteryInfo.charging && ' ⚡'}
          </span>
        </div>
      )}

      {/* Development environment indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="flex items-center gap-1">
          <Signal className="h-3 w-3 text-blue-400" />
          <span className="text-blue-400">DEV</span>
        </div>
      )}
    </div>
  );
}
