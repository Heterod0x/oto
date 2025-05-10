"use client";

import { AnchorProvider } from "@coral-xyz/anchor";
import { useAppKitNetwork, useAppKitProvider } from "@reown/appkit/react";
import { useConnection } from "@solana/wallet-adapter-react";

// network mapping
const NETWORK = {
  "Solana Mainnet": "mainnet-beta",
  "Solana Testnet": "testnet",
  "Solana Devnet": "devnet",
};

// サーバーサイドレンダリング中であるかを検出
const isServer = typeof window === "undefined";

/**
 * useAnchorProvider hook
 * @returns 
 */
export function useAnchorProvider() {
  // サーバーサイドではダミーの値を返す
  if (isServer) {
    return { provider: null, cluster: "devnet" };
  }

  try {
    const { connection } = useConnection();
    const { walletProvider } = useAppKitProvider<any>("solana");
    const { caipNetwork } = useAppKitNetwork();
    const cluster = NETWORK[caipNetwork?.name as keyof typeof NETWORK] || "devnet";

    // walletProviderが存在する場合のみProviderを作成
    let provider = null;
    if (walletProvider) {
      provider = new AnchorProvider(connection as any, walletProvider as any, {
        commitment: "confirmed",
      });
    }

    return { provider, cluster };
  } catch (error) {
    console.error("AnchorProvider initialization error:", error);
    return { provider: null, cluster: "devnet" };
  }
}
