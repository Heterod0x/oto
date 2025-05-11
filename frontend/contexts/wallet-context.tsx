"use client";

import { ethersAdapter, networks, projectId, solanaWeb3JsAdapter } from "@/config";
import { createAppKit } from "@reown/appkit";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { createContext, useEffect, useState, type ReactNode } from "react";

// Wallet context type definition
interface WalletContextType {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

// Default values
const defaultContext: WalletContextType = {
  isConnected: false,
  isConnecting: false,
  address: null,
  connect: async () => {},
  disconnect: () => {},
};

// Set up metadata
const metadata = {
  name: "oto",
  description: "oto",
  url: "https://github.com/Heterod0x/oto", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

const solanaEndpoint = clusterApiUrl("devnet");

// Create the modal
export const modal = createAppKit({
  adapters: [solanaWeb3JsAdapter, ethersAdapter],
  projectId,
  networks,
  metadata,
  themeMode: "light",
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    "--w3m-accent": "#000000",
  },
});

// Create context
export const WalletContext = createContext<WalletContextType>(defaultContext);

// Provider component
export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  // Restore wallet connection state from local storage
  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    if (storedAddress) {
      setIsConnected(true);
      setAddress(storedAddress);
    }
  }, []);

  // Wallet connection
  const connect = async () => {
    setIsConnecting(true);

    try {
      // Implement wallet connection logic in actual implementation
      // Example: MetaMask, WalletConnect, etc.

      // Dummy implementation (replace in actual implementation)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const dummyAddress = "0x1234...5678";

      setIsConnected(true);
      setAddress(dummyAddress);

      // Save to local storage
      localStorage.setItem("walletAddress", dummyAddress);
    } catch (error) {
      console.error("Wallet connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Wallet disconnection
  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    localStorage.removeItem("walletAddress");
  };

  return (
    <ConnectionProvider endpoint={solanaEndpoint}>
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
    </ConnectionProvider>
  );
}
