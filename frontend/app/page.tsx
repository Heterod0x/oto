"use client";

import { WalletContext } from "@/contexts/wallet-context";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import ConnectWalletButton from "../components/connect-wallet-button";

export default function Home() {
  const { isConnected } = useContext(WalletContext);
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/record");
    }
  }, [isConnected, router]);

  // Display recording screen or wallet connection screen based on wallet connection status
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to Oto</h1>
        <p className="text-xl text-muted-foreground">Connect your wallet to get started</p>
      </div>

      {isConnected ? null : ( // Redirecting to recording screen
        <div className="flex flex-col items-center">
          <ConnectWalletButton />
        </div>
      )}
    </div>
  );
}
