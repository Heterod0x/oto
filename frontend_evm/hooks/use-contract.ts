"use client";

import {
  createBicoPaymasterClient,
  createSmartAccountClient,
  NexusClient,
  toNexusAccount,
} from "@biconomy/abstractjs";
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";
import { createPublicClient, encodeFunctionData, http } from "viem";
import { base, baseSepolia } from "viem/chains";
import { OTO_ABI } from "../contracts/Oto";
import { CONTRACT_BASE_ADDRESS, CONTRACT_BASE_SEPOLIA_ADDRESS } from "../lib/constants";

/**
 * Custom hook to communicate with the Oto contract
 * @returns Functions and data for contract operations
 */
export const useContract = () => {
  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<any>("eip155");
  const { chainId: currentChainId } = useAppKitNetworkCore();

  /**
   * create public client
   */
  const createPublicWalletClient = (chainId: number) => {
    if (chainId === 84532) {
      return createPublicClient({
        chain: baseSepolia,
        transport: http(),
      });
    } else if (chainId === 8453) {
      return createPublicClient({
        chain: base,
        transport: http(),
      });
    }
    throw new Error(`Unsupported chain ID: ${chainId}`);
  };

  /**
   * create Smart Account Instanct function
   */
  const createSmartAccount = async (chainId: number): Promise<NexusClient> => {
    // walletProvider to Signer instance
    const ethersProvider = new BrowserProvider(walletProvider);
    // createNexusAccount
    let nexusClient: NexusClient;

    if (chainId === 84532) {
      // base sepolia client instance
      nexusClient = createSmartAccountClient({
        account: await toNexusAccount({
          // @ts-expect-error convert to ethers Signer
          signer: await ethersProvider.getSigner(),
          chain: baseSepolia,
          transport: http(),
        }),
        transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_BUNDLER_URL),
        paymaster: createBicoPaymasterClient({
          paymasterUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_PAYMASTER_URL!,
        }),
      });
    } else if (chainId === 8453) {
      // base client instance
      nexusClient = createSmartAccountClient({
        account: await toNexusAccount({
          // @ts-expect-error convert to ethers Signer
          signer: await ethersProvider.getSigner(),
          chain: base,
          transport: http(),
        }),
        transport: http(process.env.NEXT_PUBLIC_BASE_BUNDLER_URL),
        paymaster: createBicoPaymasterClient({
          paymasterUrl: process.env.NEXT_PUBLIC_BASE_PAYMASTER_URL!,
        }),
      });
    } else {
      throw new Error("Unsupported chain ID");
    }

    // get wallet address
    const smartAccountaddress = await nexusClient.account.address;
    console.log("smartAccountaddress:", smartAccountaddress);

    return nexusClient;
  };

  /**
   * get contract address by chain id
   */
  const getContractAddressByChainId = (chainId: number): `0x${string}` => {
    if (chainId === 84532) {
      return CONTRACT_BASE_SEPOLIA_ADDRESS;
    } else if (chainId === 8453) {
      return CONTRACT_BASE_ADDRESS;
    }
    throw new Error(`Unsupported chain ID: ${chainId}`);
  };

  /**
   * initialize user method
   * @param userId ユーザーID
   * @param chainId チェーンID（省略時は現在接続中のチェーンIDを使用）
   */
  const initializeUser = async (userId: string, chainId?: number) => {
    try {
      if (!address) {
        console.error("Wallet address not available");
        return null;
      }

      // チェーンID、指定がない場合は現在接続中のチェーンIDを使用
      const targetChainId = chainId ?? Number(currentChainId);
      if (!targetChainId) {
        console.error("Chain ID is not available");
        return null;
      }

      console.log(`Initializing user using chainId: ${targetChainId}`);

      // Create smart account instance
      const nexusClient = await createSmartAccount(targetChainId);

      // Encode function data
      const data = encodeFunctionData({
        abi: OTO_ABI,
        functionName: "initializeUser",
        args: [userId, address],
      });

      // Get contract address as hex string
      const contractAddress = getContractAddressByChainId(targetChainId);

      console.log("Contract address:", contractAddress);

      // Send transaction - using cast to any to avoid type issues with biconomy API
      const hash = await (nexusClient as any).sendTransaction({
        to: contractAddress,
        data,
      });

      console.log("User initialized. Transaction hash:", hash);
      return hash;
    } catch (error) {
      console.error("Error initializing user:", error);
      throw error;
    }
  };

  /**
   * claim token method
   * @param userId ユーザーID
   * @param claimAmount クレーム量
   * @param chainId チェーンID（省略時は現在接続中のチェーンIDを使用）
   */
  const claimToken = async (userId: string, claimAmount: bigint, chainId?: number) => {
    try {
      // チェーンID、指定がない場合は現在接続中のチェーンIDを使用
      const targetChainId = chainId ?? Number(currentChainId);
      if (!targetChainId) {
        console.error("Chain ID is not available");
        return null;
      }

      console.log(`Claiming token using chainId: ${targetChainId}`);

      // Create smart account instance
      const nexusClient = await createSmartAccount(targetChainId);

      // Encode function data
      const data = encodeFunctionData({
        abi: OTO_ABI,
        functionName: "claim",
        args: [userId, claimAmount],
      });

      // Get contract address as hex string
      const contractAddress = getContractAddressByChainId(targetChainId);

      // Send transaction
      const hash = await (nexusClient as any).sendTransaction({
        to: contractAddress,
        data,
      });

      console.log("Token claimed. Transaction hash:", hash);
      return hash;
    } catch (error) {
      console.error("Error claiming token:", error);
      throw error;
    }
  };

  /**
   * get user Info method
   * @param userId ユーザーID
   * @param chainId チェーンID（省略時は現在接続中のチェーンIDを使用）
   */
  const getUserInfo = async (userId: string, chainId?: number) => {
    try {
      // チェーンID、指定がない場合は現在接続中のチェーンIDを使用
      const targetChainId = chainId ?? Number(currentChainId);
      if (!targetChainId) {
        console.error("Chain ID is not available");
        return null;
      }

      // Create public client
      const publicClient = createPublicWalletClient(targetChainId);

      if (!publicClient) {
        console.error("Could not create public client");
        return null;
      }

      // Get contract address as hex string
      const contractAddress = getContractAddressByChainId(targetChainId);

      // Call contract
      const result = await publicClient.readContract({
        address: contractAddress,
        abi: OTO_ABI,
        functionName: "getUserInfo",
        args: [userId],
      });

      // Type assertion for the result based on the contract ABI
      const typedResult = result as [boolean, bigint, `0x${string}`];

      return {
        initialized: typedResult[0],
        points: typedResult[1],
        owner: typedResult[2],
      };
    } catch (error) {
      console.error("Error getting user info:", error);
      throw error;
    }
  };

  /**
   * get user by owner method
   * @param ownerAddress オーナーのアドレス
   * @param chainId チェーンID（省略時は現在接続中のチェーンIDを使用）
   */
  const getUsersByOwner = async (ownerAddress: string, chainId?: number) => {
    try {
      // チェーンID、指定がない場合は現在接続中のチェーンIDを使用
      const targetChainId = chainId ?? Number(currentChainId);
      if (!targetChainId) {
        console.error("Chain ID is not available");
        return [];
      }

      // Create public client
      const publicClient = createPublicWalletClient(targetChainId);

      if (!publicClient) {
        console.error("Could not create public client");
        return [];
      }

      // Get contract address as hex string
      const contractAddress = getContractAddressByChainId(targetChainId);

      // Call contract
      const result = await publicClient.readContract({
        address: contractAddress,
        abi: OTO_ABI,
        functionName: "getUsersByOwner",
        args: [ownerAddress as `0x${string}`],
      });

      // Type assertion for the result based on the contract ABI
      return result as string[];
    } catch (error) {
      console.error("Error getting users by owner:", error);
      return [];
    }
  };  /**
   * get user claimable token balance method
   * @param userId ユーザーID
   * @param chainId チェーンID（省略時は現在接続中のチェーンIDを使用）
   */
  const getUserClaimableTokenBalance = async (userId: string, chainId?: number) => {
    try {
      // チェーンID、指定がない場合は現在接続中のチェーンIDを使用
      const targetChainId = chainId ?? Number(currentChainId);
      
      // チェーンIDの検証
      if (!targetChainId || (targetChainId !== 8453 && targetChainId !== 84532)) {
        console.warn(`Invalid or unsupported chain ID: ${targetChainId}`);
        return BigInt(0);
      }
      
      // Get user info which contains points
      const userInfo = await getUserInfo(userId, targetChainId);

      console.log("User info:", userInfo);

      if (!userInfo || !userInfo.initialized) {
        console.log("User not initialized or info not available");
        return BigInt(0);
      }

      // The points from userInfo represent the claimable token balance
      return userInfo.points;
    } catch (error) {
      console.error("Error getting claimable token balance:", error);
      return BigInt(0);
    }
  };

  return {
    initializeUser,
    claimToken,
    getUserInfo,
    getUsersByOwner,
    getUserClaimableTokenBalance,
  };
};

export default useContract;
