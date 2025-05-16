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
import {
  fromWeb3JsKeypair,
  toWeb3JsKeypair,
  toWeb3JsTransaction,
} from "@metaplex-foundation/umi-web3js-adapters";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Send } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Detect if running on server-side
const isServer = typeof window === "undefined";

/**
 * Convert token amount to appropriate display format (considering 9 decimal places)
 * @param amount - Raw token amount (BigInt or string or number)
 * @returns Formatted token amount
 */
const formatTokenAmount = (amount: string | number): string => {
  const amountNum = typeof amount === "string" ? Number(amount) : amount;
  return (amountNum / 10 ** 9).toFixed(9).replace(/\.?0+$/, "");
};

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

  // Don't execute on the server side
  const { address: walletAddress } = !isServer ? useAppKitAccount() : { address: null };

  // Initialize contract functions at the component top level (not executed on server-side)
  const contractFunctions = useContract();

  // Initialize contract and get wallet information
  useEffect(() => {
    /**
     * Method to initialize wallet information
     */
    const initializeWallet = async () => {
      try {
        console.log("Wallet address:", walletAddress);

        if (walletAddress) {
          setAddress(walletAddress);
          setIsConnected(true);
          // Format the address display (showing only first and last few characters)
          try {
            const formatted = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-6)}`;
            setDisplayAddress(formatted);
          } catch (error) {
            setDisplayAddress("Connecting...");
          }
        }

        setContractReady(true);
      } catch (error) {
        console.error("Failed to initialize wallet:", error);
      }
    };

    if (!isServer) {
      initializeWallet();
    }
  }, [walletAddress]);

  // Check the initialization status of Oto and user accounts
  useEffect(() => {
    if (
      isServer ||
      !address ||
      !isConnected ||
      !contractReady ||
      !contractFunctions?.getOtoAccount ||
      !contractFunctions?.getUserAccount
    ) {
      return;
    }

    const checkInitializationStatus = async () => {
      try {
        // Check if Oto is initialized
        const otoAccount = await contractFunctions.getOtoAccount.refetch();
        setIsOtoInitialized(!!otoAccount.data);

        if (address) {
          // Check if user account is initialized
          const userAccount = await contractFunctions.getUserAccount(address);
          setIsUserInitialized(!!userAccount);
        }
      } catch (error) {
        console.error("Failed to check initialization status:", error);
      }
    };

    checkInitializationStatus();
  }, [
    isConnected,
    address,
    contractReady,
    contractFunctions?.getOtoAccount,
    contractFunctions?.getUserAccount,
  ]);

  // Get the claimable amount
  useEffect(() => {
    if (isServer) {
      return;
    }

    // Only set loading state on initial render
    const isDependenciesReady =
      isConnected && address && contractReady && contractFunctions?.getClaimableAmount?.refetch;

    // If any of the conditions are not met, stop loading
    if (!isDependenciesReady) {
      setIsLoadingData(false);
      return;
    }

    // If claimable amount already exists, do nothing (prevent duplicate calls)
    if (claimableAmount !== "0" && !isLoadingData) {
      return;
    }

    let isMounted = true;

    // Fetch claimable amount
    const fetchClaimableAmount = async () => {
      // Don't execute if already loading
      if (isLoadingData) return;

      try {
        setIsLoadingData(true);
        console.log("Fetching claimable token amount...");

        const data = await contractFunctions.getClaimableAmount.refetch();

        // Only update state if the component is still mounted
        if (isMounted) {
          if (data && data.data) {
            // Save original token amount (for claim processing)
            setClaimableAmount(data.data);
          }
          setIsLoadingData(false);
        }
      } catch (error) {
        console.error("Failed to fetch claimable amount:", error);
        toast.error("Failed to fetch claimable amount");
        // Only update state if the component is still mounted
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };

    fetchClaimableAmount();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [isConnected, address, contractReady]); // Remove contractFunctions from dependency array

  /**
   * Token claim processing method
   * @returns
   */
  const handleClaim = async () => {
    if (!address || !isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsClaimLoading(true);

      // Don't process if claimable amount is 0
      if (Number(claimableAmount) <= 0) {
        toast.error("No tokens available to claim");
        setIsClaimLoading(false);
        return;
      }

      if (
        !contractFunctions ||
        !contractFunctions.claimTokens ||
        !contractFunctions.claimTokens.mutateAsync
      ) {
        toast.error("Claim function is not initialized");
        setIsClaimLoading(false);
        return;
      }

      // Call the method to claim tokens
      const result = await contractFunctions.claimTokens.mutateAsync({
        userId: address,
        claimAmount: Number(claimableAmount),
      });

      console.log("Claim successful:", result);

      // Show success message
      toast.success("Token claim successful");

      // Update balance
      if (contractFunctions.getClaimableAmount && contractFunctions.getClaimableAmount.refetch) {
        await contractFunctions.getClaimableAmount.refetch();
        setClaimableAmount("0");
      }
    } catch (error) {
      console.error("Failed to claim tokens:", error);

      // Show error toast only when an error occurs
      toast.error("Failed to claim tokens");
    } finally {
      setIsClaimLoading(false);
    }
  };

  /**
   * Method to initialize Oto
   */
  const handleInitOto = async () => {
    if (!address || !isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsInitOtoLoading(true);

      console.log("Creating NFT collection with Metaplex.");

      const umi = createUmi(connection).use(keypairIdentity(fromWeb3JsKeypair(walletProvider)));

      console.log("umi:", umi);

      // get CollectionKeyPair
      const { publicKey: collectionPublicKey, secretKey } = getAssetKeypair();
      const collectionMint = createSignerFromKeypair(umi, {
        publicKey: publicKey(collectionPublicKey),
        secretKey: new Uint8Array(secretKey),
      });

      const collectionAccountExists = await umi.rpc.accountExists(collectionMint.publicKey);

      if (!collectionAccountExists) {
        // Create collection
        const umiTx = await createCollectionV1(umi, {
          collection: collectionMint,
          name: "Oto VAsset Collection",
          uri: "",
          updateAuthority: umi.identity.publicKey,
        }).buildWithLatestBlockhash(umi);
        // Convert to web3js transaction
        const web3jsTx = toWeb3JsTransaction(umiTx);
        // Send transaction
        const sig = await provider?.sendAndConfirm(web3jsTx as any, [
          toWeb3JsKeypair(collectionMint),
        ]);
        console.log("Signature:", sig);
        console.log("Successfully created NFT collection:", collectionMint.publicKey.toString());
      } else {
        console.log("NFT collection already exists:", collectionMint.publicKey.toString());
      }

      console.log("Starting Oto initialization");

      const otoAccount = await contractFunctions.getOtoAccount.refetch();
      if (!otoAccount.data) {
        // Call the Oto initialization method
        await contractFunctions.initializeOto.mutate({
          nftCollection: new PublicKey(collectionMint.publicKey),
        });
        toast.success("Oto initialization successful");
        setIsOtoInitialized(true);
      } else {
        console.log("Oto is already initialized");
        toast.info("Oto is already initialized");
        setIsOtoInitialized(true);
      }
    } catch (error) {
      console.error("Failed to initialize Oto:", error);
      toast.error("Failed to initialize Oto");
    } finally {
      setIsInitOtoLoading(false);
    }
  };

  /**
   * Method to initialize user account
   */
  const handleInitAccount = async () => {
    try {
      setIsInitUserLoading(true);

      const otoAccount = await contractFunctions.getOtoAccount.refetch();
      if (!otoAccount.data) {
        toast.error("Oto is not initialized. Please initialize Oto first.");
        setIsInitUserLoading(false);
        return;
      }

      const userAccount = await contractFunctions.getUserAccount(address);
      if (userAccount) {
        console.log("User account is already initialized");
        toast.info("User account is already initialized");
        setIsUserInitialized(true);
        setIsInitUserLoading(false);
        return;
      }

      console.log("Starting user account initialization");
      console.log("[testing purpose] Initializing with address[0:8] as user ID", address);

      await contractFunctions.initializeUser.mutate({
        userId: address,
      });
      toast.success("User account initialization successful");
      setIsUserInitialized(true);
    } catch (error) {
      console.error("Failed to initialize user account:", error);
      toast.error("Failed to initialize user account");
    } finally {
      setIsInitUserLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4 pt-8">
      {/* Wallet card */}
      <Card className="bg-muted/30 border rounded-xl p-5 mb-6 relative">
        {/* Loading overlay while data is being loaded */}
        <LoadingOverlay isLoading={isLoadingData} text="Loading data..." />

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
          <div className="text-sm text-muted-foreground mb-2">Claimable Tokens</div>
          <div className="font-medium text-lg mb-3">{formatTokenAmount(claimableAmount)} TOKEN</div>
          <LoadingButton
            className="w-full flex items-center justify-center gap-2"
            variant="default"
            onClick={handleClaim}
            disabled={
              !isConnected || Number(claimableAmount) <= 0 || isClaimLoading || !contractReady
            }
            isLoading={isClaimLoading}
          >
            <span>Claim Tokens</span>
            <Send size={16} />
          </LoadingButton>
          <br />
          <LoadingButton
            className="w-full flex items-center justify-center gap-2"
            variant="default"
            onClick={handleInitOto}
            disabled={!isConnected || isInitOtoLoading || !contractReady || isOtoInitialized}
            isLoading={isInitOtoLoading}
          >
            <span>{isOtoInitialized ? "Oto Initialized" : "Init oto"}</span>
          </LoadingButton>
          <br />
          <LoadingButton
            className="w-full flex items-center justify-center gap-2"
            variant="default"
            onClick={handleInitAccount}
            disabled={
              !isConnected ||
              isInitUserLoading ||
              !contractReady ||
              isUserInitialized ||
              !isOtoInitialized
            }
            isLoading={isInitUserLoading}
          >
            <span>{isUserInitialized ? "User Initialized" : "Init user"}</span>
          </LoadingButton>
        </div>
      </Card>

      {/* App Settings */}
      <Card className="border rounded-xl p-5">
        <h2 className="text-xl font-semibold mb-4">App Settings</h2>

        <div className="space-y-6">
          {/* Wallet Information */}
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
