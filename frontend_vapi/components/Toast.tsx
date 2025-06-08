import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';

/**
 * Toast type variants
 */
type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Props for Toast component
 */
interface ToastProps {
  /** Type of toast message affecting styling and icon */
  type: ToastType;
  /** Main title of the toast */
  title: string;
  /** Optional additional message content */
  message?: string;
  /** Whether the toast is currently visible */
  isVisible: boolean;
  /** Callback function when toast is closed */
  onClose: () => void;
  /** Whether to automatically close the toast */
  autoClose?: boolean;
  /** Duration in milliseconds before auto-close */
  duration?: number;
}

/**
 * Toast component for displaying temporary notifications
 * Supports different types (success, error, warning, info) with appropriate styling
 * 
 * @param props - Component props
 * @returns React component for toast notification
 */
export function Toast({ 
  type, 
  title, 
  message, 
  isVisible, 
  onClose, 
  autoClose = true, 
  duration = 5000 
}: ToastProps) {
  React.useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  /**
   * Configuration for different toast types including icons and colors
   */
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-800'
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-800'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      textColor: 'text-yellow-800'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      'fixed top-4 right-4 max-w-sm w-full shadow-lg rounded-lg border z-50 transition-all duration-300 transform',
      config.bgColor,
      config.borderColor,
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    )}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconColor)} />
          <div className="flex-1 min-w-0">
            <h4 className={cn('text-sm font-medium', config.textColor)}>
              {title}
            </h4>
            {message && (
              <p className={cn('text-sm mt-1', config.textColor)}>
                {message}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={cn('h-5 w-5 p-0 hover:bg-transparent', config.iconColor)}
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Toast context and hook for global toast management
interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'isVisible' | 'onClose'>) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([]);

  const showToast = React.useCallback((toast: Omit<ToastProps, 'isVisible' | 'onClose'>) => {
    const id = Math.random().toString(36).substring(2);
    setToasts(prev => [...prev, { ...toast, id, isVisible: true, onClose: () => {} }]);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
