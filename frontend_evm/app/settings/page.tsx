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

// Detect if we're in server-side rendering
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

  const { address: walletAddress } = !isServer ? useAppKitAccount() : { address: null };

  // Initialize contract functions at the component's top level (not executed on server-side)
  const { initializeUser, claimToken, getUserInfo, getUserClaimableTokenBalance } = useContract();

  // Check user initialization status
  useEffect(() => {
    if (isServer) {
      return;
    }

    // Early return for unsupported chain IDs
    if (chainId !== 8453 && chainId !== 84532) {
      console.log("Unsupported chain ID:", chainId);
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    const checkInitializationStatus = async () => {
      try {
        // Set 3 second timeout
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.log("Initialization status check timed out");
            // Consider as uninitialized by default
            setIsUserInitialized(false);
          }
        }, 3000);

        // Get user information and check initialization status
        console.log("Checking user initialization status...");
        const userInfo = await getUserInfo(walletAddress!);

        if (isMounted) {
          if (timeoutId) clearTimeout(timeoutId);
          console.log("User info:", userInfo);
          setIsUserInitialized(!!userInfo && userInfo.initialized);
          setClaimableAmount(userInfo?.points.toString() || "0");
        }
      } catch (error) {
        console.error("Failed to check initialization status:", error);
        // Consider as uninitialized even if an error occurs
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

  // Retrieve claimable token amount
  useEffect(() => {
    // Do not execute on server-side
    if (isServer) {
      return;
    }

    // Verify all dependencies are ready
    const isDependenciesReady =
      isConnected &&
      contractReady &&
      typeof getUserClaimableTokenBalance === "function" &&
      typeof getUserInfo === "function" &&
      !!chainId &&
      (chainId === 8453 || chainId === 84532); // Allow only supported chain IDs

    // If any of the conditions are not met, exit without showing loading
    if (!isDependenciesReady) {
      console.log("Dependencies are not ready:", {
        isConnected,
        hasAddress: !!walletAddress,
        contractReady,
        hasUserClaimableTokenBalance: typeof getUserClaimableTokenBalance === "function",
        hasGetUserInfo: typeof getUserInfo === "function",
        chainId,
        isValidChain: chainId === 8453 || chainId === 84532,
      });
      // Make sure to clear loading state
      setIsLoadingData(false);
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout | null = null;

    // Fetch claimable amount
    const fetchClaimableAmount = async () => {
      // Don't execute multiple times if already loading
      if (isLoadingData) return;

      try {
        // Set loading state
        setIsLoadingData(true);
        console.log("Fetching claimable amount... Chain ID:", chainId);

        // Timer to forcibly clear loading after 5 seconds (short timeout)
        timeoutId = setTimeout(() => {
          if (isMounted) {
            console.log("Fetching claimable amount timed out");
            setIsLoadingData(false);
            // Do not show error message to avoid hurting user experience
            // toast.error("Data loading timed out");
          }
        }, 5000);

        try {
          // Get user information
          const userInfo = await getUserInfo(walletAddress!);

          // If user is not initialized, set balance to 0 and exit early
          if (!userInfo || !userInfo.initialized) {
            console.log("User is not initialized, so balance is 0");
            if (isMounted) {
              setClaimableAmount("0");
              setIsLoadingData(false);
              if (timeoutId) clearTimeout(timeoutId);
            }
            return;
          }

          // Get claimable token balance (using user info since we already have it)
          const balance = userInfo.points; // Get directly from userInfo

          // Only update state if the component is still mounted
          if (isMounted) {
            console.log("Retrieved balance:", balance.toString());
            setClaimableAmount(balance.toString());
            setIsLoadingData(false);
            if (timeoutId) clearTimeout(timeoutId);
          }
        } catch (error) {
          console.error("Error occurred while retrieving user information:", error);
          if (isMounted) {
            setClaimableAmount("0");
            setIsLoadingData(false);
            if (timeoutId) clearTimeout(timeoutId);
          }
        }
      } catch (error) {
        console.error("Failed to retrieve claimable amount:", error);
        // Only update state if the component is still mounted
        if (isMounted) {
          // Set to 0 in case of an error
          setClaimableAmount("0");
          // Stop loading even if an error occurred
          setIsLoadingData(false);
          // Clear timeout timer
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
   * Token claim method
   * @returns
   */
  const handleClaim = async () => {
    if (!walletAddress) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsClaimLoading(true);

      // Check network status
      console.log("Current network:", chainId);
      if (chainId !== 8453 && chainId !== 84532) {
        toast.error(
          "Unsupported network. Please switch to Base or Base Sepolia.",
        );
        setIsClaimLoading(false);
        return;
      }

      // Don't process if claimable amount is 0
      if (Number(claimableAmount) <= 0) {
        toast.error("No tokens available to claim");
        setIsClaimLoading(false);
        return;
      }

      if (typeof claimToken !== "function") {
        toast.error("Claim function is not initialized");
        setIsClaimLoading(false);
        return;
      }

      // Call the method to claim tokens (chainID is optional)
      const claimPromise = claimToken(walletAddress, BigInt(claimableAmount));
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Claim process timed out")), 30000);
      });

      const hash = await Promise.race([claimPromise, timeoutPromise]);

      if (hash) {
        toast.success("Successfully claimed tokens");

        // Set balance to zero
        setClaimableAmount("0");

        // Wait a bit before checking balance again
        setTimeout(async () => {
          if (typeof getUserClaimableTokenBalance === "function") {
            try {
              // Show loading state for a short time
              setIsLoadingData(true);
              const newBalance = await getUserClaimableTokenBalance(walletAddress);
              setClaimableAmount(newBalance.toString());
            } catch (error) {
              console.error("Failed to get balance after claim:", error);
            } finally {
              // Clear loading state in any case
              setIsLoadingData(false);
            }
          }
        }, 3000);
      } else {
        toast.error("Failed to send transaction");
      }
    } catch (error) {
      console.error("Failed to claim tokens:", error);
      toast.error("Failed to claim tokens");
    } finally {
      setIsClaimLoading(false);
    }
  };

  /**
   * Method to initialize user account
   */
  const handleInitAccount = async () => {
    if (!walletAddress || !chainId) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsInitUserLoading(true);

      // Check network status
      console.log("Current network:", chainId);
      if (chainId !== 8453 && chainId !== 84532) {
        toast.error(
          "Unsupported network. Please switch to Base or Base Sepolia.",
        );
        setIsInitUserLoading(false);
        return;
      }

      // Check if user is already initialized
      console.log("Checking user information...", walletAddress);

      try {
        const userInfo = await getUserInfo(walletAddress);
        if (userInfo && userInfo.initialized) {
          console.log("User account is already initialized");
          toast.info("User account is already initialized");
          setIsUserInitialized(true);
          setIsInitUserLoading(false);
          return;
        }
      } catch (checkError) {
        console.warn(
          "Error occurred while checking user information, but continuing with initialization:",
          checkError,
        );
      }

      console.log("Starting user account initialization:", walletAddress);

      // Set 30 second timeout
      const initPromise = initializeUser(walletAddress);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Initialization process timed out")), 30000);
      });

      const hash = await Promise.race([initPromise, timeoutPromise]);
      console.log("Initialization transaction:", hash);

      if (hash) {
        toast.success("Successfully initialized user account");
        setIsUserInitialized(true);

        // Wait a bit before retrieving claimable amount again
        setTimeout(async () => {
          if (typeof getUserClaimableTokenBalance === "function") {
            try {
              // Update loading state
              setIsLoadingData(true);
              const newBalance = await getUserClaimableTokenBalance(walletAddress);
              setClaimableAmount(newBalance.toString());
            } catch (error) {
              console.error("Failed to get balance after initialization:", error);
              toast.error("Failed to update balance. Please reload the page.");
            } finally {
              // Clear loading state in any case
              setIsLoadingData(false);
            }
          }
        }, 3000);
      } else {
        toast.error("Failed to send transaction");
      }
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
        {isLoadingData && <LoadingOverlay isLoading={true} text="Loading data..." />}

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
          <div className="text-sm text-muted-foreground mb-2">Claimable tokens</div>
          <div className="font-medium text-lg mb-3">{claimableAmount} TOKEN</div>
          <LoadingButton
            className="w-full flex items-center justify-center gap-2"
            variant="default"
            onClick={handleClaim}
            disabled={Number(claimableAmount) <= 0}
            isLoading={isClaimLoading}
          >
            <span>Claim tokens</span>
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
            <span>{isUserInitialized ? "User initialized" : "Initialize user"}</span>
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
