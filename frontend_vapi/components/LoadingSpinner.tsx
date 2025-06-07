import { cn } from '../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'white' | 'gray';
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  color = 'primary' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'border-violet-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-400 border-t-transparent'
  };

  return (
    <div
      className={cn(
        'border-2 rounded-full animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  message = 'Processing...', 
  className 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center',
      className
    )}>
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm mx-4 text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
}
