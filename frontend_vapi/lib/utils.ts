import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * API error type definition
 */
export type APIError = {
  /** Error message */
  error: string;
  /** Optional cause of the error */
  cause?: string;
};

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 *
 * @param inputs - Array of class values to merge
 * @returns Merged and optimized class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
