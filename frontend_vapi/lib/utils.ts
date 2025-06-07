import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type APIError = {
  error: string;
  cause?: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
