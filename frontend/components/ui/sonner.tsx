"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center" 
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-primary/20 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-gray-800 dark:group-[.toaster]:border-gray-700",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "group-[.toast]:border-l-4 group-[.toast]:border-l-green-600 group-[.toast]:bg-green-100 group-[.toast]:text-green-800 dark:group-[.toast]:bg-green-900/80 dark:group-[.toast]:text-green-300",
          error: "group-[.toast]:border-l-4 group-[.toast]:border-l-red-500 group-[.toast]:bg-gradient-to-r group-[.toast]:from-red-100 group-[.toast]:to-red-50 group-[.toast]:text-red-800 dark:group-[.toast]:from-red-900 dark:group-[.toast]:to-red-800 dark:group-[.toast]:text-red-400",
          warning: "group-[.toast]:border-l-4 group-[.toast]:border-l-yellow-500 group-[.toast]:bg-gradient-to-r group-[.toast]:from-yellow-100 group-[.toast]:to-yellow-50 group-[.toast]:text-yellow-800",
          info: "group-[.toast]:border-l-4 group-[.toast]:border-l-blue-500 group-[.toast]:bg-gradient-to-r group-[.toast]:from-blue-100 group-[.toast]:to-blue-50 group-[.toast]:text-blue-800",
        },
        duration: 5000,
      }}
      {...props}
    />
  );
};

export { Toaster };
