"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Switch } from "@/components/ui/switch";
import useContract from "@/hooks/use-contract";
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider } from "@reown/appkit/react";
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
  const [isInitUserLoading, setIsInitUserLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [claimableAmount, setClaimableAmount] = useState("0");
  const [contractReady, setContractReady] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isUserInitialized, setIsUserInitialized] = useState(false);

  const { theme, setTheme } = useTheme();

  const { walletProvider } = useAppKitProvider<any>("eip155");
  const { chainId } = !isServer ? useAppKitNetworkCore() : { chainId: undefined };

  // サーバーサイドでは実行しない
  const { address: walletAddress } = !isServer ? useAppKitAccount() : { address: null };

  // コントラクト機能をコンポーネントのトップレベルで初期化（サーバーサイドでは実行しない）
  const { initializeUser, claimToken, getUserInfo, getUserClaimableTokenBalance } = useContract();

  // ユーザーの初期化状態を確認
  useEffect(() => {
    if (isServer) {
      return;
    }

    // サポート対象外のチェーンIDの場合も早期リターン
    if (chainId !== 8453 && chainId !== 84532) {
      console.log("サポートされていないチェーンID:", chainId);
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    const checkInitializationStatus = async () => {
      try {
        // 3秒のタイムアウトを設定
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.log("初期化状態確認がタイムアウトしました");
            // デフォルトで未初期化と見なす
            setIsUserInitialized(false);
          }
        }, 3000);

        // ユーザー情報を取得して初期化状態を確認
        console.log("ユーザー初期化状態を確認中...");
        const userInfo = await getUserInfo(walletAddress!);

        if (isMounted) {
          if (timeoutId) clearTimeout(timeoutId);
          console.log("ユーザー情報:", userInfo);
          setIsUserInitialized(!!userInfo && userInfo.initialized);
          setClaimableAmount(userInfo?.points.toString() || "0");
        }
      } catch (error) {
        console.error("初期化状態の確認に失敗しました:", error);
        // エラーが発生しても初期化されていないと判断
        if (isMounted) {
          if (timeoutId) clearTimeout(timeoutId);
          setIsUserInitialized(false);
        }
      }
    };

    checkInitializationStatus();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isConnected, walletAddress, contractReady, getUserInfo, chainId]);

  // 初期状態では必ずローディングを非表示にする
  useEffect(() => {
    if (!isServer) {
      setIsLoadingData(false);
    }
  }, []);

  // クレーム可能な金額を取得
  useEffect(() => {
    // サーバーサイドでは実行しない
    if (isServer) {
      return;
    }

    // 依存関係が揃っていることを確認
    const isDependenciesReady =
      isConnected &&
      contractReady &&
      typeof getUserClaimableTokenBalance === "function" &&
      typeof getUserInfo === "function" &&
      !!chainId &&
      (chainId === 8453 || chainId === 84532); // サポート対象のチェーンIDのみ許可

    // いずれかの条件が満たされていない場合は、ローディングを表示せずに終了
    if (!isDependenciesReady) {
      console.log("依存関係が揃っていません:", {
        isConnected,
        hasAddress: !!walletAddress,
        contractReady,
        hasUserClaimableTokenBalance: typeof getUserClaimableTokenBalance === "function",
        hasGetUserInfo: typeof getUserInfo === "function",
        chainId,
        isValidChain: chainId === 8453 || chainId === 84532,
      });
      // ローディング状態を確実に解除
      setIsLoadingData(false);
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    // クレーム可能額の取得
    const fetchClaimableAmount = async () => {
      // すでにローディング中であれば重複して実行しない
      if (isLoadingData) return;

      try {
        // ローディング状態にする
        setIsLoadingData(true);
        console.log("クレーム可能金額を取得中... チェーンID:", chainId);

        // 5秒後に強制的にローディングを解除するタイマー（短めに設定）
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.log("クレーム可能金額の取得がタイムアウトしました");
            setIsLoadingData(false);
            // ユーザー体験を損なわないためにエラーメッセージは表示しない
            // toast.error("データの読み込みがタイムアウトしました");
          }
        }, 5000);

        try {
          // ユーザー情報を取得
          const userInfo = await getUserInfo(walletAddress!);

          // ユーザーが初期化されていない場合は0を設定して早期に終了
          if (!userInfo || !userInfo.initialized) {
            console.log("ユーザーは初期化されていないため、残高は0です");
            if (isMounted) {
              setClaimableAmount("0");
              setIsLoadingData(false);
              if (timeoutId) clearTimeout(timeoutId);
            }
            return;
          }

          // クレーム可能なトークン残高を取得（すでにユーザー情報があるためそれを使用）
          const balance = userInfo.points; // 直接userInfoから取得

          // コンポーネントがマウントされている場合のみ状態を更新
          if (isMounted) {
            console.log("取得した残高:", balance.toString());
            setClaimableAmount(balance.toString());
            setIsLoadingData(false);
            if (timeoutId) clearTimeout(timeoutId);
          }
        } catch (error) {
          console.error("ユーザー情報の取得中にエラーが発生しました:", error);
          if (isMounted) {
            setClaimableAmount("0");
            setIsLoadingData(false);
            if (timeoutId) clearTimeout(timeoutId);
          }
        }
      } catch (error) {
        console.error("クレーム可能金額の取得に失敗しました:", error);
        // コンポーネントがマウントされている場合のみ状態を更新
        if (isMounted) {
          // エラーが発生した場合は0を設定
          setClaimableAmount("0");
          // エラーが発生した場合でもローディングを停止
          setIsLoadingData(false);
          // タイムアウトタイマーをクリア
          if (timeoutId) clearTimeout(timeoutId);
        }
      }
    };

    // データ取得を実行
    fetchClaimableAmount();

    // クリーンアップ関数
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    isConnected,
    walletAddress,
    contractReady,
    getUserClaimableTokenBalance,
    getUserInfo,
    chainId,
  ]);

  /**
   * クレーム処理 メソッド
   * @returns
   */
  const handleClaim = async () => {
    if (!walletAddress) {
      toast.error("ウォレットを接続してください");
      return;
    }

    try {
      setIsClaimLoading(true);

      // ネットワーク状態を確認
      console.log("現在のネットワーク:", chainId);
      if (chainId !== 8453 && chainId !== 84532) {
        toast.error(
          "サポートされていないネットワークです。Base または Base Sepolia に切り替えてください。",
        );
        setIsClaimLoading(false);
        return;
      }

      // クレーム可能金額が0の場合は処理しない
      if (Number(claimableAmount) <= 0) {
        toast.error("クレーム可能なトークンがありません");
        setIsClaimLoading(false);
        return;
      }

      if (typeof claimToken !== "function") {
        toast.error("クレーム機能が初期化されていません");
        setIsClaimLoading(false);
        return;
      }

      // トークンをクレームするメソッドを呼び出す（チェーンIDは省略可能）
      const claimPromise = claimToken(walletAddress, BigInt(claimableAmount));
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("クレーム処理がタイムアウトしました")), 30000);
      });

      const hash = await Promise.race([claimPromise, timeoutPromise]);

      if (hash) {
        toast.success("トークンのクレームに成功しました");

        // 残高をゼロに設定
        setClaimableAmount("0");

        // 少し待ってから残高を再確認
        setTimeout(async () => {
          if (typeof getUserClaimableTokenBalance === "function") {
            try {
              // ローディング状態を短時間だけ表示
              setIsLoadingData(true);
              const newBalance = await getUserClaimableTokenBalance(walletAddress);
              setClaimableAmount(newBalance.toString());
            } catch (error) {
              console.error("クレーム後の残高取得に失敗しました:", error);
            } finally {
              // どの場合でもローディング状態を解除
              setIsLoadingData(false);
            }
          }
        }, 3000);
      } else {
        toast.error("トランザクションの送信に失敗しました");
      }
    } catch (error) {
      console.error("トークンのクレームに失敗しました:", error);
      toast.error("トークンのクレームに失敗しました");
    } finally {
      setIsClaimLoading(false);
    }
  };

  /**
   * ユーザーアカウントを初期化するメソッド
   */
  const handleInitAccount = async () => {
    if (!walletAddress || !chainId) {
      toast.error("ウォレットを接続してください");
      return;
    }

    try {
      setIsInitUserLoading(true);

      // ネットワーク状態を確認
      console.log("現在のネットワーク:", chainId);
      if (chainId !== 8453 && chainId !== 84532) {
        toast.error(
          "サポートされていないネットワークです。Base または Base Sepolia に切り替えてください。",
        );
        setIsInitUserLoading(false);
        return;
      }

      // ユーザーが初期化済みかどうか確認
      console.log("ユーザー情報を確認中...", walletAddress);

      try {
        const userInfo = await getUserInfo(walletAddress);
        if (userInfo && userInfo.initialized) {
          console.log("ユーザーアカウントが既に初期化されています");
          toast.info("ユーザーアカウントは既に初期化されています");
          setIsUserInitialized(true);
          setIsInitUserLoading(false);
          return;
        }
      } catch (checkError) {
        console.warn(
          "ユーザー情報の確認中にエラーが発生しましたが、初期化を続行します:",
          checkError,
        );
      }

      console.log("ユーザーアカウントの初期化を開始します:", walletAddress);

      // 30秒のタイムアウトを設定
      const initPromise = initializeUser(walletAddress);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("初期化処理がタイムアウトしました")), 30000);
      });

      const hash = await Promise.race([initPromise, timeoutPromise]);
      console.log("初期化トランザクション:", hash);

      if (hash) {
        toast.success("ユーザーアカウントの初期化に成功しました");
        setIsUserInitialized(true);

        // 少し待ってからクレーム可能金額を再取得
        setTimeout(async () => {
          if (typeof getUserClaimableTokenBalance === "function") {
            try {
              // ローディング状態を更新
              setIsLoadingData(true);
              const newBalance = await getUserClaimableTokenBalance(walletAddress);
              setClaimableAmount(newBalance.toString());
            } catch (error) {
              console.error("初期化後の残高取得に失敗しました:", error);
              toast.error("残高の更新に失敗しました。ページを再読み込みしてください。");
            } finally {
              // どの場合でもローディング状態を解除
              setIsLoadingData(false);
            }
          }
        }, 3000);
      } else {
        toast.error("トランザクションの送信に失敗しました");
      }
    } catch (error) {
      console.error("ユーザーアカウントの初期化に失敗しました:", error);
      toast.error("ユーザーアカウントの初期化に失敗しました");
    } finally {
      setIsInitUserLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4 pt-8">
      {/* ウォレットカード */}
      <Card className="bg-muted/30 border rounded-xl p-5 mb-6 relative">
        {/* データ読み込み中のローディングオーバーレイ */}
        {isLoadingData && <LoadingOverlay isLoading={true} text="データを読み込み中..." />}

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
          <LoadingButton
            className="w-full flex items-center justify-center gap-2"
            variant="default"
            onClick={handleClaim}
            disabled={Number(claimableAmount) <= 0}
            isLoading={isClaimLoading}
          >
            <span>トークンをクレーム</span>
            <Send size={16} />
          </LoadingButton>
          <br />
          <LoadingButton
            className="w-full flex items-center justify-center gap-2"
            variant="default"
            onClick={handleInitAccount}
            disabled={isUserInitialized}
            isLoading={isInitUserLoading}
          >
            <span>{isUserInitialized ? "ユーザー初期化済み" : "ユーザーを初期化"}</span>
          </LoadingButton>
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
