"use client";

import {
  useAppKitAccount
} from '@reown/appkit/react';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Home page component
 * @returns 
 */
export default function Home() {
  const router = useRouter();
  const {address, caipAddress, isConnected, embeddedWalletInfo} = useAppKitAccount();

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
        SignUp / SignIn
      </h1>
      <appkit-button />
    </div>
  );
}
