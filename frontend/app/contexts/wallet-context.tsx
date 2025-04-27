"use client";

import { createContext, useState, useEffect, type ReactNode } from "react";

// ウォレットコンテキストの型定義
interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

// デフォルト値
const defaultContext: WalletContextType = {
  isConnected: false,
  isConnecting: false,
  address: null,
  connect: async () => {},
  disconnect: () => {},
};

// コンテキストの作成
export const WalletContext = createContext<WalletContextType>(defaultContext);

// プロバイダーコンポーネント
export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  // ローカルストレージからウォレット接続状態を復元
  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setIsConnected(true);
      setAddress(storedAddress);
    }
  }, []);

  // ウォレット接続
  const connect = async () => {
    setIsConnecting(true);

    try {
      // 実際の実装ではウォレット接続ロジックを実装
      // 例: MetaMask, WalletConnect など

      // ダミー実装（実際の実装では置き換え）
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const dummyAddress = "0x1234...5678";

      setIsConnected(true);
      setAddress(dummyAddress);

      // ローカルストレージに保存
      localStorage.setItem("walletAddress", dummyAddress);
    } catch (error) {
      console.error("ウォレット接続エラー:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // ウォレット切断
  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    localStorage.removeItem("walletAddress");
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        isConnecting,
        address,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
