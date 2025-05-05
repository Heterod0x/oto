"use client";

import { BN, Program } from "@coral-xyz/anchor";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { Oto } from "@/contracts/oto";
import otoIdl from "@/contracts/oto.json";
import { useAnchorProvider } from "./useAnchorProvider";


/**
 * Otoコントラクトと通信するためのカスタムフック
 * @returns コントラクト操作用の関数とデータ
 */
export const useContract = () => {
  const [otoPDA, setOtoPDA] = useState<string | null>(null);
  const [userPDA, setUserPDA] = useState<string | null>(null);
  const [mintPDA, setMintPDA] = useState<string | null>(null);

  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<any>("solana");
  const { provider, cluster } = useAnchorProvider();

  // プログラムIDとプログラムインスタンスをメモ化
  const programId = useMemo(() => {
    try {
      return new PublicKey(otoIdl.address);
    } catch (error) {
      console.error("Failed to create PublicKey:", error);
      return null;
    }
  }, []);

  // Otoプログラムインスタンス
  const program = useMemo(() => {
    try {
      if (!provider || !programId) return null;
      // Program クラスを直接使用してプログラムインスタンスを作成
      return new Program<Oto>(otoIdl as any,{
        connection: provider.connection,
      });
    } catch (error) {
      console.error("Failed to create Program instance:", error);
      return null;
    }
  }, [provider, programId]);

  // PDAsの計算
  useEffect(() => {
    /**
     * calculatePDAs method
     * @returns 
     */
    const calculatePDAs = async () => {
      if (!program) return;

      console.log("Program ID:", programId);

      // Oto PDA
      const [oto] = await PublicKey.findProgramAddressSync(
        [walletProvider.publicKey.toBytes()],
        programId as any,
      );
      setOtoPDA(oto.toBase58());

      // Mint PDA
      const [mint] = await PublicKey.findProgramAddressSync(
        [walletProvider.publicKey.toBytes()],
        programId as any,
      );
      setMintPDA(mint.toBase58());
    };

    calculatePDAs();
  }, [program, programId]);

  /**
   * 特定ユーザーのPDAを算出
   * @param userId
   * @returns
   */
  const getUserPDA = async (userId: string) => {
    if (!program) return null;
    console.log("Program ID:", programId);
    console.log("User ID:", userId);

    // PDA - USER_SEEDとuserIdを使用して正しいPDAを生成
    const [userPDA] = await PublicKey.findProgramAddressSync(
      [walletProvider.publicKey.toBytes()],
      programId as any,
    );
    return userPDA.toBase58();
  };

  /**
   * get User Account PDA
   * @param userId
   * @returns
   */
  const getUserAccount = async (userId: string) => {
    // call getUserPDA
    const userAddress = await getUserPDA(userId);
    console.log("User Address:", userAddress);
    if (!userAddress || !program) return null;

    // PDA - USER_SEEDとuserIdを使用して正しいPDAを生成
    const [userPDA] = await PublicKey.findProgramAddressSync(
      [walletProvider.publicKey.toBytes()],
      programId as any,
    );

    try {
      // call fetch method
      console.log("userPDA", userPDA);
      return await program.account.user.fetch(userPDA);
    } catch (error) {
      // エラーの種類を判別
      if (error instanceof Error && error.message.includes("Account does not exist")) {
        console.log("ユーザーアカウントが存在しません:", userId);
      }
      console.error("ユーザー情報取得エラー:", error);
      return null;
    }
  };

  /**
   * ユーザーを初期化するミューテーション
   */
  const initializeUser = useMutation({
    mutationKey: ["oto", "initializeUser", { cluster }],
    mutationFn: async ({ userId, owner }: { userId: string; owner?: string }) => {
      if (!program || !address || !otoPDA) throw new Error("Not initialized");

      // 指定されたオーナーまたは現在の接続アドレスを使用
      const ownerKey = owner ? new PublicKey(owner) : new PublicKey(address);

      // ユーザーのPDAを計算
      const calculatedUserPDA = await getUserPDA(userId);
      if (!calculatedUserPDA) throw new Error("Failed to calculate user PDA");

      return program.methods
        .initializeUser(userId, ownerKey)
        .accounts({
          payer: address,
        })
        .rpc();
    },
  });

  /**
   * トークンをクレームするミューテーション
   */
  const claimTokens = useMutation({
    mutationKey: ["oto", "claim", { cluster }],
    mutationFn: async ({ userId, claimAmount }: { userId: string; claimAmount: number }) => {
      if (!program || !address || !otoPDA || !mintPDA) throw new Error("Not initialized");

      // ユーザーPDAを計算
      const calculatedUserPDA = await getUserPDA(userId);
      if (!calculatedUserPDA) throw new Error("Failed to calculate user PDA");

      // ATAを計算
      const [userTokenAccount] = await PublicKey.findProgramAddressSync(
        [walletProvider.publicKey.toBytes()],
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      return program.methods
        .claim(userId, new BN(claimAmount))
        .accounts({
          beneficiary: address,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
    },
  });

  /**
   * ポイント更新のミューテーション（管理者用）
   */
  const updatePoint = useMutation({
    mutationKey: ["oto", "updatePoint", { cluster }],
    mutationFn: async ({ userId, delta }: { userId: string; delta: number }) => {
      if (!program || !address || !otoPDA) throw new Error("Not initialized");

      // ユーザーPDAを計算
      const calculatedUserPDA = await getUserPDA(userId);
      if (!calculatedUserPDA) throw new Error("Failed to calculate user PDA");

      return program.methods
        .updatePoint(userId, new BN(delta))
        .accounts({
          oto: otoPDA,
          user: calculatedUserPDA,
          admin: address,
        })
        .rpc();
    },
  });

  /**
   *  Otoアカウント情報の取得するクエリ
   */
  const getOtoAccount = useQuery({
    queryKey: ["oto", "otoAccount", { cluster }],
    queryFn: async () => {
      if (!program || !otoPDA) throw new Error("Not initialized");
      return program.account.oto.fetch(otoPDA);
    },
    enabled: !!program && !!otoPDA,
  });

  /**
   * ユーザーのクレーム可能な金額を取得するクエリ
   */
  const getClaimableAmount = useQuery({
    queryKey: ["oto", "claimableAmount", { userId: address, cluster }],
    queryFn: async () => {
      if (!address || !program) throw new Error("Not initialized");

      try {
        const userId = address; // ユーザーIDとして現在のアドレスを使用
        console.log("ユーザーID:", userId);
        const userAccount = await getUserAccount(userId);
        
        // アカウントが存在しない場合は0を返す
        if (!userAccount) {
          console.log("ユーザーアカウントが存在しないため、クレーム可能金額は0です");
          return "0";
        }
        
        // claimableAmountが存在するか確認
        if (userAccount.claimableAmount) {
          const amount = userAccount.claimableAmount.toString();
          console.log(`ユーザー ${userId} のクレーム可能金額: ${amount}`);
          return amount;
        }
        
        return "0";
      } catch (error) {
        console.error("クレーム可能金額取得エラー:", error);
        throw new Error("クレーム可能金額の取得に失敗しました");
      }
    },
    enabled: !!program && !!address,
    staleTime: 60 * 1000, // 1分間はキャッシュを使用
    refetchOnWindowFocus: true, // ウィンドウフォーカス時に再取得
    retry: 2, // エラー時に2回リトライ
  });

  return {
    program,
    programId,
    otoPDA,
    mintPDA,
    getUserPDA,
    getUserAccount,
    initializeUser,
    claimTokens,
    updatePoint,
    getOtoAccount,
    getClaimableAmount,
  };
};

export default useContract;
