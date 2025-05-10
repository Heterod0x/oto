"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Switch } from "@/components/ui/switch";
import useContract from "@/hooks/use-contract";
import { useAnchorProvider } from "@/hooks/useAnchorProvider";
import { getAssetKeypair } from "@/lib/keypair-utils";
import { createCollectionV1 } from "@metaplex-foundation/mpl-core";
import { createSignerFromKeypair, keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { fromWeb3JsKeypair, toWeb3JsKeypair, toWeb3JsTransaction } from "@metaplex-foundation/umi-web3js-adapters";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
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
  const [isInitOtoLoading, setIsInitOtoLoading] = useState(false);
  const [isInitUserLoading, setIsInitUserLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [claimableAmount, setClaimableAmount] = useState("0");
  const [contractReady, setContractReady] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isOtoInitialized, setIsOtoInitialized] = useState(false);
  const [isUserInitialized, setIsUserInitialized] = useState(false);

  const { theme, setTheme } = useTheme();

  const { connection } = useConnection();
  const { provider } = useAnchorProvider();
  const { walletProvider } = useAppKitProvider<any>("solana");

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

  // Otoとユーザーアカウントの初期化状態を確認
  useEffect(() => {
    if (isServer || !address || !isConnected || !contractReady || 
        !contractFunctions?.getOtoAccount || !contractFunctions?.getUserAccount) {
      return;
    }

    const checkInitializationStatus = async () => {
      try {
        // Otoの初期化状態を確認
        const otoAccount = await contractFunctions.getOtoAccount.refetch();
        setIsOtoInitialized(!!otoAccount.data);
        
        if (address) {
          // ユーザーアカウントの初期化状態を確認
          const userAccount = await contractFunctions.getUserAccount(address);
          setIsUserInitialized(!!userAccount);
        }
      } catch (error) {
        console.error("初期化状態の確認に失敗しました:", error);
      }
    };
    
    checkInitializationStatus();
  }, [isConnected, address, contractReady, contractFunctions?.getOtoAccount, contractFunctions?.getUserAccount]);

  // クレーム可能な金額を取得
  useEffect(() => {
    if (isServer) {
      return;
    }

    // 初回レンダリング時にのみローディング状態にする
    const isDependenciesReady = isConnected && address && contractReady && 
                               contractFunctions?.getClaimableAmount?.refetch;
    
    // いずれかの条件が満たされていない場合は、ローディングを停止
    if (!isDependenciesReady) {
      setIsLoadingData(false);
      return;
    }

    // すでにクレーム可能金額がある場合は何もしない（重複呼び出しを防止）
    if (claimableAmount !== "0" && !isLoadingData) {
      return;
    }
    
    let isMounted = true;
    
    // クレーム可能額の取得
    const fetchClaimableAmount = async () => {
      // すでにローディング中であれば重複して実行しない
      if (isLoadingData) return;
      
      try {
        setIsLoadingData(true);
        console.log("クレーム可能金額を取得中...");
        
        const data = await contractFunctions.getClaimableAmount.refetch();
        
        // コンポーネントがマウントされている場合のみ状態を更新
        if (isMounted) {
          if (data && data.data) {
            setClaimableAmount(data.data);
          }
          setIsLoadingData(false);
        }
      } catch (error) {
        console.error("クレーム可能金額の取得に失敗しました:", error);
        toast.error("クレーム可能金額の取得に失敗しました");
        // コンポーネントがマウントされている場合のみ状態を更新
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };

    fetchClaimableAmount();
    
    // クリーンアップ関数
    return () => {
      isMounted = false;
    };
  }, [isConnected, address, contractReady]); // contractFunctionsを依存配列から削除

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

  /**
   * Otoを初期化するメソッド
   */
  const handleInitOto = async () => {
    if (!address || !isConnected) {
      toast.error("ウォレットを接続してください");
      return;
    }

    try {
      setIsInitOtoLoading(true);

      console.log("MetaplexでNFTコレクションを作成します。")

      const umi = createUmi(connection).use(
        keypairIdentity(fromWeb3JsKeypair(walletProvider))
      );

      console.log("umi:", umi);
      
      // get CollectionKeyPair 
      const { publicKey: collectionPublicKey, secretKey } = getAssetKeypair();
      const collectionMint = createSignerFromKeypair(umi, {
        publicKey: publicKey(collectionPublicKey),
        secretKey: new Uint8Array(secretKey),
      });

      const collectionAccountExists = await umi.rpc.accountExists(collectionMint.publicKey);
    
      if (!collectionAccountExists) {
        // コレクションの作成
        const umiTx = await createCollectionV1(umi, {
          collection: collectionMint,
          name: "Oto VAsset Collection",
          uri: "",
          updateAuthority: umi.identity.publicKey,
        }).buildWithLatestBlockhash(umi);
        // web3js用のTxに変換する
        const web3jsTx = toWeb3JsTransaction(umiTx);
        // トランザクションを送信する
        const sig = await provider?.sendAndConfirm(web3jsTx as any, [toWeb3JsKeypair(collectionMint)]);
        console.log("Signature:", sig);
        console.log("NFTコレクションの作成に成功しました:", collectionMint.publicKey.toString());
      }else{
        console.log("NFTコレクションが存在します:", collectionMint.publicKey.toString());
      }

      console.log("Otoの初期化を開始します");

      const otoAccount = await contractFunctions.getOtoAccount.refetch();
      if (!otoAccount.data) {
        // Otoの初期化メソッドを呼び出す
        await contractFunctions.initializeOto.mutate({
          nftCollection: new PublicKey(collectionMint.publicKey)
        });
        toast.success("Otoの初期化に成功しました");
        setIsOtoInitialized(true);
      } else {
        console.log("Otoが既に初期化されています");
        toast.info("Otoは既に初期化されています");
        setIsOtoInitialized(true);
      }
    } catch (error) {
      console.error("Otoの初期化に失敗しました:", error);
      toast.error("Otoの初期化に失敗しました");
    } finally {
      setIsInitOtoLoading(false);
    }
  };

  /**
   * ユーザーアカウントを初期化するメソッド
   */
  const handleInitAccount = async () => {
    try {
      setIsInitUserLoading(true);

      const otoAccount = await contractFunctions.getOtoAccount.refetch();
      if (!otoAccount.data) {
        toast.error("Otoが初期化されていません。まずOtoを初期化してください。");
        setIsInitUserLoading(false);
        return;
      }

      const userAccount = await contractFunctions.getUserAccount(address);
      if (userAccount) {
        console.log("ユーザーアカウントが既に初期化されています");
        toast.info("ユーザーアカウントは既に初期化されています");
        setIsUserInitialized(true);
        setIsInitUserLoading(false);
        return;
      }

      console.log("ユーザーアカウントの初期化を開始します");
      console.log("[testing purpose] アドレス[0:8]をユーザーIDとして初期化します", address);

      await contractFunctions.initializeUser.mutate({
        userId: address,
      });
      toast.success("ユーザーアカウントの初期化に成功しました");
      setIsUserInitialized(true);
    } catch (error) {
      console.error("ユーザーアカウントの初期化に失敗しました:", error);
      toast.error("ユーザーアカウントの初期化に失敗しました");
    } finally {
      setIsInitUserLoading(false);
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4 pt-8">
      {/* ウォレットカード */}
      <Card className="bg-muted/30 border rounded-xl p-5 mb-6 relative">
        {/* データ読み込み中のローディングオーバーレイ */}
        <LoadingOverlay 
          isLoading={isLoadingData} 
          text="データを読み込み中..." 
        />
        
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
            disabled={
              !isConnected || Number(claimableAmount) <= 0 || isClaimLoading || !contractReady
            }
            isLoading={isClaimLoading}
          >
            <span>トークンをクレーム</span>
            <Send size={16} />
          </LoadingButton>
          <br />
          <LoadingButton
            className="w-full flex items-center justify-center gap-2"
            variant="default"
            onClick={handleInitOto}
            disabled={
              !isConnected || isInitOtoLoading || !contractReady || isOtoInitialized
            }
            isLoading={isInitOtoLoading}
          >
            <span>{isOtoInitialized ? "Oto 初期化済み" : "Init oto"}</span>
          </LoadingButton>
          <br />
          <LoadingButton
            className="w-full flex items-center justify-center gap-2"
            variant="default"
            onClick={handleInitAccount}
            disabled={
              !isConnected || isInitUserLoading || !contractReady || isUserInitialized || !isOtoInitialized
            }
            isLoading={isInitUserLoading}
          >
            <span>{isUserInitialized ? "ユーザー初期化済み" : "Init user"}</span>
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
