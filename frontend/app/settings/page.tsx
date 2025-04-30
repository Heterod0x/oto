"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  // ウォレット情報
  const [balance, setBalance] = useState("0.00");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isClaimLoading, setIsClaimLoading] = useState(false);

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
  }, []);

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
      <appkit-button />
    </div>
  );
}
