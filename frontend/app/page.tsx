"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/app/hooks/use-wallet";
import { ConnectWalletButton } from "@/app/components/connect-wallet-button";

export default function Home() {
  const router = useRouter();
  const { isConnected } = useWallet();

  // ウォレット接続状態に応じて録音画面またはウォレット接続画面を表示
  useEffect(() => {
    if (isConnected) {
      router.push("/record");
    }
  }, [isConnected, router]);

  if (isConnected) {
    return null; // 録音画面にリダイレクト中
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="mb-8 text-2xl font-bold text-center">
        Privyなどの
        <br />
        Social login
      </h1>
      <ConnectWalletButton />
    </div>
  );
}
