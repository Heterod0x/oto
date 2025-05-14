"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  // Store the PWA installation prompt event
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  // Whether the prompt can be displayed
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default prompt
      e.preventDefault();
      // Store the event
      setDeferredPrompt(e);
      // Make the prompt available
      setShowInstallPrompt(true);
    };

    // Check if already installed from local storage
    const isInstalled = localStorage.getItem("pwaInstalled") === "true";

    if (!isInstalled) {
      // Register event listener
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }

    return () => {
      // Remove event listener when component unmounts
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Function to execute installation
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show installation prompt
    deferredPrompt.prompt();

    // Wait for user's choice
    const choiceResult = await deferredPrompt.userChoice;

    // Process based on selection result
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the installation");
      localStorage.setItem("pwaInstalled", "true");
    } else {
      console.log("User declined the installation");
    }

    // Clear the used prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  // Function to close the banner
  const dismissPrompt = () => {
    setShowInstallPrompt(false);
    // Save setting to not show for 24 hours
    const now = new Date();
    localStorage.setItem("installPromptDismissed", now.toString());
  };

  // Don't display anything if prompt is not available
  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 mx-auto max-w-sm p-4 z-50">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex flex-col">
        <div className="flex justify-between items-start">
          <h3 className="font-bold">Install App</h3>
          <button onClick={dismissPrompt} className="text-primary-foreground">
            <X size={18} />
          </button>
        </div>
        <p className="text-sm my-2">Add to your home screen for offline use</p>
        <Button onClick={handleInstallClick} className="mt-2 w-full">
          Install
        </Button>
      </div>
    </div>
  );
}
