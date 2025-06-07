import { useEffect, useRef, useState } from 'react';

/**
 * Hook to measure performance metrics
 */
export function usePerformanceMonitor(componentName: string) {
  const mountTime = useRef<number>(Date.now());
  const [renderTime, setRenderTime] = useState<number>(0);

  useEffect(() => {
    const endTime = Date.now();
    const duration = endTime - mountTime.current;
    setRenderTime(duration);

    // Log output only in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} mounted in ${duration}ms`);
    }
  }, [componentName]);

  return { renderTime };
}

/**
 * Hook to monitor network status
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updateConnectionType = () => {
      // @ts-ignore - experimental API
      if (navigator.connection) {
        // @ts-ignore
        setConnectionType(navigator.connection.effectiveType || 'unknown');
      }
    };

    updateOnlineStatus();
    updateConnectionType();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // @ts-ignore
    if (navigator.connection) {
      // @ts-ignore
      navigator.connection.addEventListener('change', updateConnectionType);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      // @ts-ignore
      if (navigator.connection) {
        // @ts-ignore
        navigator.connection.removeEventListener('change', updateConnectionType);
      }
    };
  }, []);

  return { isOnline, connectionType };
}

/**
 * Hook to monitor battery status (experimental API)
 */
export function useBatteryStatus() {
  const [batteryInfo, setBatteryInfo] = useState<{
    level: number;
    charging: boolean;
  } | null>(null);

  useEffect(() => {
    // @ts-ignore - experimental API
    if (navigator.getBattery) {
      // @ts-ignore
      navigator.getBattery().then((battery: any) => {
        const updateBatteryInfo = () => {
          setBatteryInfo({
            level: battery.level,
            charging: battery.charging,
          });
        };

        updateBatteryInfo();
        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);

        return () => {
          battery.removeEventListener('levelchange', updateBatteryInfo);
          battery.removeEventListener('chargingchange', updateBatteryInfo);
        };
      });
    }
  }, []);

  return batteryInfo;
}

/**
 * Hook to monitor memory usage (Chrome only)
 */
export function useMemoryUsage() {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      // @ts-ignore - Chrome specific API
      if (performance.memory) {
        // @ts-ignore
        setMemoryInfo({
          // @ts-ignore
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          // @ts-ignore
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          // @ts-ignore
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
}
