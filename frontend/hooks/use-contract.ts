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

// Constants
const OTO_SEED = "oto";
const USER_SEED = "user";
const MINT_SEED = "mint";

/**
 * Custom hook to communicate with the Oto contract
 * @returns Functions and data for contract operations
 */
export const useContract = () => {
  const [otoPDA, setOtoPDA] = useState<string | null>(null);
  const [userPDA, setUserPDA] = useState<string | null>(null);
  const [mintPDA, setMintPDA] = useState<string | null>(null);

  const { address } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<any>("solana");
  const { provider, cluster } = useAnchorProvider();

  // Memoize program ID and program instance
  const programId = useMemo(() => {
    try {
      return new PublicKey(otoIdl.address);
    } catch (error) {
      console.error("Failed to create PublicKey:", error);
      return null;
    }
  }, []);

  // Oto program instance
  const program = useMemo(() => {
    try {
      if (!provider || !programId) return null;
      // Create Program class correctly
      return new Program<Oto>(otoIdl as any, provider);
    } catch (error) {
      console.error("Failed to create Program instance:", error);
      return null;
    }
  }, [provider, programId]);

  // Calculation of PDAs
  useEffect(() => {
    /**
     * calculatePDAs method
     * @returns
     */
    const calculatePDAs = async () => {
      if (!program || !programId) return;

      console.log("Program ID:", programId.toBase58());

      // Oto PDA - correct seeds based on IDL definition
      const [oto] = PublicKey.findProgramAddressSync([Buffer.from(OTO_SEED)], programId);
      setOtoPDA(oto.toBase58());
      console.log("Oto PDA:", oto.toBase58());

      // Mint PDA - correct seeds based on IDL definition
      const [mint] = PublicKey.findProgramAddressSync([Buffer.from(MINT_SEED)], programId);
      setMintPDA(mint.toBase58());
      console.log("Mint PDA:", mint.toBase58());
    };

    calculatePDAs();
  }, [program, programId]);

  const getUserId = (address: string) => {
    return address.substring(0, 8);
  };

  /**
   * Calculate PDA for a specific user
   * @param userId
   * @returns
   */
  const getUserPDA = async (userId: string) => {
    if (!programId) return null;
    console.log("Program ID:", programId.toBase58());
    console.log("User ID:", userId);

    // If user ID is too long, use only the first 8 characters
    // Or, if using the wallet address, limit to a certain length
    const shortenedUserId = getUserId(userId);
    console.log("Shortened User ID:", shortenedUserId);

    // PDA - generate correct PDA using USER_SEED and userId
    const [userPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from(USER_SEED), Buffer.from(shortenedUserId)],
      programId,
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
      // Identify cases where the account does not exist
      if (
        error.message?.includes("Account does not exist") ||
        error.message?.includes("account not found") ||
        error.message?.includes("Program failed to complete")
      ) {
        console.log("User account does not exist:", userId);

        if (!program || !address || !otoPDA || !mintPDA) throw new Error("Not initialized");
      }

      return null;
    }
  };

  /**
   * Mutation to initialize a user
   */
  const initializeUser = useMutation({
    mutationKey: ["oto", "initializeUser", { cluster }],
    mutationFn: async ({ userId, owner }: { userId: string; owner?: string }) => {
      if (!program || !address || !otoPDA) throw new Error("Not initialized");

      const shortenedUserId = getUserId(userId);

      // Use the specified owner or the current connected address
      const ownerKey = owner ? new PublicKey(owner) : new PublicKey(address);

      // Calculate the user's PDA
      const calculatedUserPDA = await getUserPDA(userId);
      if (!calculatedUserPDA) throw new Error("Failed to calculate user PDA");

      console.log("User PDA to initialize:", calculatedUserPDA);
      console.log("Oto PDA:", otoPDA);
      console.log("Payer:", address);

      // Correctly specify the required accounts based on the IDL
      try {
        const sig = await program.methods
          .initializeUser(shortenedUserId, ownerKey)
          .accounts({
            payer: new PublicKey(address),
          })
          .rpc();
        console.log(sig);
      } catch (error) {
        console.error("Failed to initialize user account:", error);
      }
    },
  });

  /**
   * Mutation to initialize the Oto program
   */
  const initializeOto = useMutation({
    mutationKey: ["oto", "initializeOto", { cluster }],
    mutationFn: async ({ nftCollection }: { nftCollection: PublicKey }) => {
      if (!program || !address || !programId) throw new Error("Not initialized");

      // Calculate PDAs
      const [otoPDA] = PublicKey.findProgramAddressSync([Buffer.from(OTO_SEED)], programId);

      const [mintPDA] = PublicKey.findProgramAddressSync([Buffer.from(MINT_SEED)], programId);

      console.log("Oto PDA:", otoPDA.toBase58());
      console.log("Mint PDA:", mintPDA.toBase58());

      // Calculate metadata address
      const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
      );
      const metadataAddress = PublicKey.findProgramAddressSync(
        [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBytes(), mintPDA.toBytes()],
        TOKEN_METADATA_PROGRAM_ID,
      )[0];

      console.log("Oto PDA to initialize:", otoPDA.toBase58());
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
   * Mutation to claim tokens
   */
  const claimTokens = useMutation({
    mutationKey: ["oto", "claim", { cluster }],
    mutationFn: async ({ userId, claimAmount }: { userId: string; claimAmount: number }) => {
      if (!program || !address || !otoPDA || !mintPDA) throw new Error("Not initialized");

      // Calculate user PDA
      const shortenedUserId = getUserId(userId);
      const calculatedUserPDA = await getUserPDA(shortenedUserId);
      if (!calculatedUserPDA) throw new Error("Failed to calculate user PDA");

      // Calculate ATA
      const [userTokenAccount] = await PublicKey.findProgramAddressSync(
        [walletProvider.publicKey.toBytes()],
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      return program.methods
        .claim(shortenedUserId, new BN(claimAmount))
        .accounts({
          beneficiary: address,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
    },
  });

  /**
   * Mutation to update points (for admin)
   */
  const updatePoint = useMutation({
    mutationKey: ["oto", "updatePoint", { cluster }],
    mutationFn: async ({ userId, delta }: { userId: string; delta: number }) => {
      if (!program || !address || !otoPDA) throw new Error("Not initialized");

      // Calculate user PDA
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
   * Query to get Oto account information
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
   * Query to get the claimable amount for a user
   * Automatically initializes the user if they do not exist
   */
  const getClaimableAmount = useQuery({
    queryKey: ["oto", "claimableAmount", { userId: address, cluster }],
    queryFn: async () => {
      if (!address || !program) throw new Error("Not initialized");

      try {
        const userId = address; // Use the current address as the user ID
        console.log("User ID:", userId);

        // Get user account information
        let userAccount = await getUserAccount(userId);

        console.log("User account information:", userAccount);

        if (!userAccount) {
          console.log("User account is not initialized. Returning claimable amount as 0");
          return "0";
        }

        // Check if claimableAmount exists
        if (userAccount.claimableAmount) {
          console.log("userAccount.claimableAmount:", userAccount.claimableAmount);
          const amount = userAccount.claimableAmount.toString();
          console.log(`Claimable amount for user ${userId}: ${amount}`);
          return amount;
        }

        return "0";
      } catch (error) {
        console.error("Error fetching claimable amount:", error);
        return "0"; // Return 0 in case of error (to avoid breaking the UI)
      }
    },
    enabled: !!program && !!address && !!walletProvider,
    staleTime: 60 * 1000, // Use cache for 1 minute
    refetchOnWindowFocus: true, // Refetch on window focus
    retry: 2, // Retry 2 times on error
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
