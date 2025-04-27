"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { useWallet } from "@/app/hooks/use-wallet";
import { Wallet, ArrowDown, ArrowUp, Send } from "lucide-react";

export default function SettingsPage() {
  // ウォレット情報
  const { isConnected, connect, disconnect, address } = useWallet();
  const [balance, setBalance] = useState("0.00");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

  // ウォレット情報の取得
  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (!isConnected) return;

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
  }, [isConnected]);

  // トークンをクレーム
  const claimTokens = async () => {
    setIsClaimLoading(true);

    try {
      // APIにリクエスト
      // await fetch('/api/claim', {
      //   method: 'POST',
      // });

      // 成功したら残高を更新
      console.log("トークンのクレームが完了しました");
      // 残高の更新処理
    } catch (error) {
      console.error("トークンのクレームに失敗しました:", error);
    } finally {
      setIsClaimLoading(false);
    }
  };

  return (
    <div className="container p-4">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium">Wallet</CardTitle>
          {isConnected ? (
            <Button variant="ghost" size="sm" onClick={disconnect}>
              切断
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={connect}>
              接続
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {isConnected ? (
            <>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Available Balance</span>
                  <span className="text-sm">USD ▼</span>
                </div>
                <div className="bg-muted/50 p-4 rounded-md">
                  <span className="text-2xl font-bold">${balance}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Recent Transactions</h3>
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-2 border-b">
                      <div className="flex items-center gap-2">
                        {tx.type === "sent" ? (
                          <ArrowUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-green-500" />
                        )}
                        <div>
                          <p className="text-sm">
                            {tx.type === "sent"
                              ? `Sent to ${tx.recipient}`
                              : `Received from ${tx.sender}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{tx.time}</p>
                        </div>
                      </div>
                      <span className={tx.type === "sent" ? "text-red-500" : "text-green-500"}>
                        {tx.type === "sent" ? "-" : "+"}${tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full mt-4" variant="default">
                <Send className="h-4 w-4 mr-2" />
                Send - $100
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-center text-muted-foreground mb-4">
                ウォレットを接続して、トークンを管理しましょう
              </p>
              <Button onClick={connect}>ウォレットを接続</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="text-md font-medium">収益</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span>Claim可能なトークン</span>
              <span className="font-bold">210 $NVS</span>
            </div>
            <Button className="w-full" onClick={claimTokens} disabled={isClaimLoading}>
              {isClaimLoading ? "クレーム中..." : "Claim"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
