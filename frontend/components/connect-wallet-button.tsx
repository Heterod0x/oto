"use client";

import { Button } from "@/app/components/ui/button";
import { useWallet } from "@/app/hooks/use-wallet";

export function ConnectWalletButton() {
  const { connect, isConnecting } = useWallet();

  return (
    <Button onClick={connect} disabled={isConnecting} className="w-full max-w-xs">
      {isConnecting ? "接続中..." : "Connect Wallet"}
    </Button>
  );
}
