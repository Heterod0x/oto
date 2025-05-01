"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ChevronDown, Copy, Send } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// クライアントサイドでのみ実行されるコンポーネント
export default function SettingsPage() {
  // ウォレット情報
  const [balance, setBalance] = useState("0.00");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [currency, setCurrency] = useState("USD");
  const [address, setAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [claimableAmount, setClaimableAmount] = useState("0");
  const [contractReady, setContractReady] = useState(false);
  const [contractFunctions, setContractFunctions] = useState<any>(null);

  // コントラクトの初期化とウォレット情報の取得
  useEffect(() => {
    // クライアントサイドでのみ実行される
    const initializeContract = async () => {
      try {
        // 動的にインポート
        const { useContract } = await import("@/hooks/use-contract");
        const { useAppKitAccount } = await import("@reown/appkit/react");

        // ウォレット情報を取得
        const { address: walletAddress } = useAppKitAccount();
        if (walletAddress) {
          setAddress(walletAddress);
          setIsConnected(true);
          // アドレスの表示形式を整形（最初と最後の数文字のみ表示）
          try {
            const formatted = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-6)}`;
            setDisplayAddress(formatted);
          } catch (error) {
            setDisplayAddress("接続中...");
          }
        }

        // コントラクト機能を初期化
        const contract = useContract();
        setContractFunctions(contract);
        setContractReady(true);
      } catch (error) {
        console.error("コントラクトの初期化に失敗しました:", error);
      }
    };

    initializeContract();
  }, []);

  // ウォレット情報の取得
  useEffect(() => {
    const fetchWalletInfo = async () => {
      try {
        // ダミーデータ（実際の実装ではAPIから取得）
        setBalance("2,458.00");
        setTransactions([
          {
            id: "1",
            type: "sent",
            recipient: "John",
            amount: "150.00",
            time: "2 hours ago",
          },
          {
            id: "2",
            type: "received",
            sender: "Sarah",
            amount: "280.00",
            time: "Yesterday",
          },
        ]);
      } catch (error) {
        console.error("ウォレット情報の取得に失敗しました:", error);
      }
    };

    fetchWalletInfo();
  }, []);

  // クレーム可能な金額を取得
  useEffect(() => {
    if (isConnected && address && contractReady && contractFunctions?.getClaimableAmount) {
      const fetchClaimableAmount = async () => {
        try {
          const data = await contractFunctions.getClaimableAmount.refetch();
          if (data && data.data) {
            setClaimableAmount(data.data);
          }
        } catch (error) {
          console.error("クレーム可能金額の取得に失敗しました:", error);
        }
      };

      fetchClaimableAmount();
    }
  }, [isConnected, address, contractReady, contractFunctions]);

  // アドレスをコピー
  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("アドレスをクリップボードにコピーしました");
    }
  };

  // クレーム処理
  const handleClaim = async () => {
    if (!address || !isConnected) {
      toast.error("ウォレットを接続してください");
      return;
    }

    try {
      setIsClaimLoading(true);

      // クレーム可能金額が0の場合は処理しない
      if (Number(claimableAmount) <= 0) {
        toast.error("クレーム可能なトークンがありません");
        setIsClaimLoading(false);
        return;
      }

      if (
        !contractFunctions ||
        !contractFunctions.claimTokens ||
        !contractFunctions.claimTokens.mutateAsync
      ) {
        toast.error("クレーム機能が初期化されていません");
        setIsClaimLoading(false);
        return;
      }

      // トークンをクレームするメソッドを呼び出す
      await contractFunctions.claimTokens.mutateAsync({
        userId: address,
        claimAmount: Number(claimableAmount),
      });

      toast.success("トークンのクレームに成功しました");

      // 残高を更新
      if (contractFunctions.getClaimableAmount && contractFunctions.getClaimableAmount.refetch) {
        await contractFunctions.getClaimableAmount.refetch();
        setClaimableAmount("0");
      }
    } catch (error) {
      console.error("トークンのクレームに失敗しました:", error);
      toast.error("トークンのクレームに失敗しました");
    } finally {
      setIsClaimLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4 pt-8">
      {/* ウォレットカード */}
      <Card className="bg-muted/30 border rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" />
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4" />
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
              </svg>
            </div>
            <span className="text-lg font-medium">Wallet</span>
          </div>
          <div className="flex items-center">
            <Avatar className="h-10 w-10 bg-green-500 text-white">
              <span className="text-lg font-semibold">C</span>
            </Avatar>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground">Available Balance</span>
            <div className="flex items-center">
              <span className="mr-1">{currency}</span>
              <ChevronDown size={16} className="opacity-70" />
            </div>
          </div>
          <div className="text-3xl font-semibold">${balance}</div>
        </div>

        <div className="space-y-4">
          <div className="mb-3">
            <span className="text-sm text-muted-foreground">Recent Transactions</span>
          </div>

          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between py-2 border-t border-muted"
            >
              <div className="flex items-center">
                {transaction.type === "sent" ? (
                  <div className="mr-3 p-2 rounded-full bg-muted">
                    <ArrowUp size={16} />
                  </div>
                ) : (
                  <div className="mr-3 p-2 rounded-full bg-muted">
                    <ArrowDown size={16} />
                  </div>
                )}
                <div>
                  <div className="font-medium">
                    {transaction.type === "sent"
                      ? `Sent to ${transaction.recipient}`
                      : `Received from ${transaction.sender}`}
                  </div>
                  <div className="text-sm text-muted-foreground">{transaction.time}</div>
                </div>
              </div>
              <div
                className={cn(
                  "font-medium",
                  transaction.type === "sent" ? "text-destructive" : "text-green-600",
                )}
              >
                {transaction.type === "sent" ? "-" : "+"}${transaction.amount}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="text-sm text-muted-foreground mb-2">クレーム可能なトークン</div>
          <div className="font-medium text-lg mb-3">{claimableAmount} TOKEN</div>
          <Button
            className="w-full flex items-center justify-center gap-2"
            variant="default"
            onClick={handleClaim}
            disabled={
              !isConnected || Number(claimableAmount) <= 0 || isClaimLoading || !contractReady
            }
          >
            {isClaimLoading ? (
              <span>処理中...</span>
            ) : (
              <>
                <span>トークンをクレーム</span>
                <Send size={16} />
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* アプリ設定 */}
      <Card className="border rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">App Settings</h2>

        <div className="space-y-6">
          {/* ウォレット情報 */}
          <div className="space-y-2">
            <h3 className="font-medium">Wallet</h3>
            <div className="rounded-lg border p-4 space-y-4">
              {isConnected ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-sm">{displayAddress}</p>
                      <Button variant="ghost" size="sm" className="h-8 px-2" onClick={copyAddress}>
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">SOL Balance</p>
                    <p>0.000 SOL</p>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        localStorage.removeItem("walletAddress");
                        setIsConnected(false);
                      }}
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-2">
                  {/* AppKitのウォレット接続ボタン */}
                  <appkit-button />
                </div>
              )}
            </div>
          </div>

          {/* アピアランス */}
          <div className="space-y-2">
            <h3 className="font-medium">Appearance</h3>
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark mode</Label>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
