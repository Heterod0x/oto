import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  text,
  fullScreen = false,
  className,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center bg-background/80 z-50",
        fullScreen ? "fixed inset-0" : "absolute inset-0 rounded-md",
        className,
      )}
    >
      <Spinner size="lg" />
      {text && <p className="mt-4 text-sm font-medium text-muted-foreground">{text}</p>}
    </div>
  );
}
