"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import useContract from "@/hooks/use-contract";
import { useAppKitAccount } from "@reown/appkit/react";
import { Send } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// サーバーサイドレンダリング中であるかを検出
const isServer = typeof window === "undefined";

/**
 * Setting Page Component
 * @returns
 */
export default function SettingsPage() {
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [claimableAmount, setClaimableAmount] = useState("0");
  const [contractReady, setContractReady] = useState(false);

  const { theme, setTheme } = useTheme();

  // サーバーサイドでは実行しない
  const { address: walletAddress } = !isServer ? useAppKitAccount() : { address: null };

  // コントラクト機能をコンポーネントのトップレベルで初期化（サーバーサイドでは実行しない）
  const contractFunctions = useContract();

  // コントラクトの初期化とウォレット情報の取得
  useEffect(() => {
    /**
     * ウォレット情報の初期化メソッド
     */
    const initializeWallet = async () => {
      try {
        console.log("ウォレットアドレス:", walletAddress);

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

        setContractReady(true);
      } catch (error) {
        console.error("ウォレットの初期化に失敗しました:", error);
      }
    };

    if (!isServer) {
      initializeWallet();
    }
  }, [walletAddress]);

  // クレーム可能な金額を取得
  useEffect(() => {
    console.log("address:", address);

    if (isServer) return;

    if (isConnected && address && contractReady && contractFunctions?.getClaimableAmount) {
      // call refetch method
      const fetchClaimableAmount = async () => {
        try {
          // call refetch method
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

  /**
   * クレーム処理 メソッド
   * @returns
   */
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
              <div className="py-2">
                {/* AppKitのウォレット接続ボタン */}
                <appkit-button />
              </div>
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
