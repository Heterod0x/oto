"use client";

import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { address: walletAddress } = useAppKitAccount();
  const router = useRouter();

  useEffect(() => {
    if (walletAddress) {
      router.push("/record");
    }
  }, [walletAddress, router]);

  // Display recording screen or wallet connection screen based on wallet connection status
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to Oto</h1>
        <p className="text-xl text-muted-foreground">Connect your wallet to get started</p>
      </div>

      {walletAddress ? null : ( // Redirecting to recording screen
        <div className="flex flex-col items-center">
          <appkit-button />
        </div>
      )}
    </div>
  );
}
