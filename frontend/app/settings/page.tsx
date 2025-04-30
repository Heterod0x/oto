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

export default function SettingsPage() {
  // ウォレット情報
  const [balance, setBalance] = useState("0.00");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [currency, setCurrency] = useState("USD");
  const [address, setAddress] = useState("4ZT9...5rpPNi");
  const [isConnected, setIsConnected] = useState(false);

  // ウォレット情報の取得
  useEffect(() => {
    const fetchWalletInfo = async () => {
      try {
        // APIからデータを取得
        // const response = await fetch('/api/wallet');
        // const data = await response.json();
        // setBalance(data.balance);
        // setTransactions(data.transactions);

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

    // ウォレット接続状態をチェック
    const checkConnection = async () => {
      // ここで実際の接続状態を確認する処理が入る
      const storedAddress = localStorage.getItem("walletAddress");
      setIsConnected(!!storedAddress);
    };
    
    checkConnection();
  }, []);

  // アドレスをコピー
  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    // ここでトーストなどで通知を表示するとよい
    console.log("アドレスをクリップボードにコピーしました");
  };

  // 送金処理
  const handleSend = () => {
    console.log("送金画面へ");
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
          
          {transactions.map(transaction => (
            <div key={transaction.id} className="flex items-center justify-between py-2 border-t border-muted">
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
              <div className={cn(
                "font-medium",
                transaction.type === "sent" ? "text-destructive" : "text-green-600"
              )}>
                {transaction.type === "sent" ? "-" : "+"}${transaction.amount}
              </div>
            </div>
          ))}
        </div>

        <Button 
          className="w-full mt-6 flex items-center justify-center gap-2"
          variant="default"
          onClick={handleSend}
        >
          <span>Claim</span>
          <Send size={16} />
        </Button>
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
                      <p className="font-mono text-sm">{address}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2"
                        onClick={copyAddress}
                      >
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
