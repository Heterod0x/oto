"use client";

import { Button } from "@/components/ui/button";
import { WalletContext } from "@/contexts/wallet-context";
import { useContext } from "react";

export default function ConnectWalletButton() {
  const { connect, isConnecting } = useContext(WalletContext);

  return (
    <Button onClick={connect} disabled={isConnecting} className="w-full max-w-xs">
      {isConnecting ? "接続中..." : "Connect Wallet"}
    </Button>
  );
}
