"use client";

import { BN, Program } from "@coral-xyz/anchor";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import { Oto } from "@/contracts/oto";
import otoIdl from "@/contracts/oto.json";
import { useAnchorProvider } from "./useAnchorProvider";

// 定数
const OTO_SEED = "oto";
const USER_SEED = "user";
const MINT_SEED = "mint";

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
      // Program クラスを正しく作成
      return new Program<Oto>(otoIdl as any, provider);
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
      if (!program || !programId) return;

      console.log("Program ID:", programId.toBase58());

      // Oto PDA - IDL定義に基づく正しいシード
      const [oto] = PublicKey.findProgramAddressSync(
        [Buffer.from(OTO_SEED)],
        programId
      );
      setOtoPDA(oto.toBase58());
      console.log("Oto PDA:", oto.toBase58());

      // Mint PDA - IDL定義に基づく正しいシード
      const [mint] = PublicKey.findProgramAddressSync(
        [Buffer.from(MINT_SEED)],
        programId
      );
      setMintPDA(mint.toBase58());
      console.log("Mint PDA:", mint.toBase58());
    };

    calculatePDAs();
  }, [program, programId]);

  const getUserId = (address: string) => {
    return address.substring(0, 8);
  }

  /**
   * 特定ユーザーのPDAを算出
   * @param userId
   * @returns
   */
  const getUserPDA = async (userId: string) => {
    if (!programId) return null;
    console.log("Program ID:", programId.toBase58());
    console.log("User ID:", userId);
    
    // ユーザーIDが長すぎる場合は、最初の8文字だけを使用
    // もしくは、ウォレットのアドレスを使用する場合は一定の長さに制限する
    const shortenedUserId = getUserId(userId);
    console.log("Shortened User ID:", shortenedUserId);

    // PDA - USER_SEEDとuserIdを使用して正しいPDAを生成
    const [userPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(USER_SEED), Buffer.from(shortenedUserId)],
      programId
    );
    return userPDA.toBase58();
  };

  /**
   * get User Account PDA
   * @param userId
   * @returns
   */
  const getUserAccount = async (userId: string) => {
    if (!program || !programId) return null;

    try {
      // call getUserPDA to get correct user PDA
      const userAddress = await getUserPDA(userId);
      console.log("User Address:", userAddress);
      if (!userAddress) return null;

      const userPDA = new PublicKey(userAddress);
      console.log("userPDA", userPDA.toBase58());
      
      // call fetch method with the correct PDA
      return await program.account.user.fetch(userPDA);
    } catch (error: any) {
      // アカウントが存在しないケースを特定
      if (
        error.message?.includes("Account does not exist") ||
        error.message?.includes("account not found") ||
        error.message?.includes("Program failed to complete")
      ) {
        console.log("ユーザーアカウントが存在しません:", userId);

        if (!program || !address || !otoPDA || !mintPDA) throw new Error("Not initialized");
      }

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

      const shortenedUserId = getUserId(userId);

      // 指定されたオーナーまたは現在の接続アドレスを使用
      const ownerKey = owner ? new PublicKey(owner) : new PublicKey(address);

      // ユーザーのPDAを計算
      const calculatedUserPDA = await getUserPDA(userId);
      if (!calculatedUserPDA) throw new Error("Failed to calculate user PDA");

      console.log("初期化するユーザーPDA:", calculatedUserPDA);
      console.log("Oto PDA:", otoPDA);
      console.log("支払者:", address);

      // IDLに基づいて必要なアカウントを正しく指定
      try{
      const sig = await program.methods
        .initializeUser(shortenedUserId, ownerKey)
        .accounts({
          payer: new PublicKey(address),
        })
        .rpc();
        console.log(sig);
      }catch(error){
        console.error("ユーザーアカウントの初期化に失敗しました:", error);
      }
    },
  });

  /**
   * Otoプログラムを初期化するミューテーション
   */
  const initializeOto = useMutation({
    mutationKey: ["oto", "initializeOto", { cluster }],
    mutationFn: async ({ nftCollection }: { nftCollection: PublicKey }) => {
      if (!program || !address || !programId) throw new Error("Not initialized");

      // PDAsの計算
      const [otoPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(OTO_SEED)],
        programId
      );
      
      const [mintPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from(MINT_SEED)],
        programId
      );

      console.log("Oto PDA:", otoPDA.toBase58());
      console.log("Mint PDA:", mintPDA.toBase58());
      
      // metadataアドレスの計算
      const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
      const metadataAddress = PublicKey.findProgramAddressSync(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBytes(),
          mintPDA.toBytes(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )[0];

      console.log("初期化するOto PDA:", otoPDA.toBase58());
      console.log("Mint PDA:", mintPDA.toBase58());
      console.log("NFT Collection:", nftCollection.toBase58());
      console.log("Metadata Address:", metadataAddress.toBase58());
      
      return await program.methods
        .initializeOto()
        .accounts({
          payer: new PublicKey(address),
          nftCollection: nftCollection,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          metadata: metadataAddress,
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
      const shortenedUserId = getUserId(userId);
      const calculatedUserPDA = await getUserPDA(shortenedUserId);
      if (!calculatedUserPDA) throw new Error("Failed to calculate user PDA");

      // ATAを計算
      const [userTokenAccount] = await PublicKey.findProgramAddressSync(
        [walletProvider.publicKey.toBytes()],
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      return program.methods
        .claim(shortenedUserId, new BN(claimAmount))
        .accounts({
          beneficiary: address,
          tokenProgram: TOKEN_PROGRAM_ID,
        }).rpc();
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
      const shortenedUserId = getUserId(userId);
      const calculatedUserPDA = await getUserPDA(shortenedUserId);
      if (!calculatedUserPDA) throw new Error("Failed to calculate user PDA");

      return program.methods
        .updatePoint(shortenedUserId, new BN(delta))
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
   * ユーザーが存在しない場合は自動的に初期化を行う
   */
  const getClaimableAmount = useQuery({
    queryKey: ["oto", "claimableAmount", { userId: address, cluster }],
    queryFn: async () => {
      if (!address || !program) throw new Error("Not initialized");

      try {
        const userId = address; // ユーザーIDとして現在のアドレスを使用
        console.log("ユーザーID:", userId);
        
        // ユーザーアカウント情報を取得
        let userAccount = await getUserAccount(userId);

        console.log("ユーザーアカウント情報:", userAccount);

        if (!userAccount) {
          console.log("ユーザーアカウントが初期化されていません. Claimable Amount を0として返します");
          return "0";
        }
          
        // claimableAmountが存在するか確認
        if (userAccount.claimableAmount) {
          console.log("userAccount.claimableAmount:", userAccount.claimableAmount)
          const amount = userAccount.claimableAmount.toString();
          console.log(`ユーザー ${userId} のクレーム可能金額: ${amount}`);
          return amount;
        }
        
        return "0";
      } catch (error) {
        console.error("クレーム可能金額取得エラー:", error);
        return "0"; // エラーの場合は0を返す（UIを壊さない）
      }
    },
    enabled: !!program && !!address && !!walletProvider,
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
    initializeOto,
    claimTokens,
    updatePoint,
    getOtoAccount,
    getClaimableAmount,
  };
};

export default useContract;
