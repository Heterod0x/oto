/** * Common type definitions for frontend_vapi application */ /** * Standard API response wrapper */ export interface ApiResponse<
  T = any,
> {
  /** Response data */ data: T /** Response status */;
  status: "success" | "error" /** Error message if status is error */;
  message?: string;
} /** * Loading state for async operations */
export interface LoadingState {
  /** Whether operation is currently loading */ isLoading: boolean /** Error message if operation failed */;
  error: string | null;
} /** * Pagination parameters */
export interface PaginationParams {
  /** Page number (0-indexed) */ page: number /** Number of items per page */;
  limit: number;
} /** * Common component props that most components accept */
export interface CommonComponentProps {
  /** Additional CSS class names */ className?: string /** Test ID for automated testing */;
  testId?: string;
} /** * Voice session configuration */
export interface VoiceSessionConfig {
  /** Sample rate for audio recording */ sampleRate?: number /** Enable echo cancellation */;
  echoCancellation?: boolean /** Enable noise suppression */;
  noiseSuppression?: boolean /** Auto gain control */;
  autoGainControl?: boolean;
} /** * Task priority levels */
export type TaskPriority = "low" | "medium" | "high"; /** * Task types */
export type TaskType = "TODO" | "CAL" | "TASK"; /** * Toast notification types */
export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info"; /** * Wallet chain types supported by the application */
export type ChainType = "ethereum" | "solana";
