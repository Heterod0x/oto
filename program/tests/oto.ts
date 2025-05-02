import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Oto } from "../target/types/oto";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { CoreAssetBuilder } from "./core_asset_builder";
import { expect } from "chai";
import { ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
describe("oto", () => {
  // Configure
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Oto as Program<Oto>;

  // Generate keypairs
  const authority = Keypair.generate();
  const user = Keypair.generate();

  // Metaplex Core Asset
  const coreAssetBuilder = new CoreAssetBuilder(provider, authority);

  it("airdrop", async () => {
    let tx = await provider.connection.requestAirdrop(
      authority.publicKey,
      LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(tx);

    tx = await provider.connection.requestAirdrop(
      user.publicKey,
      LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(tx);
  });

  it("create collection", async () => {
    await coreAssetBuilder.createCollection();
  });

  it("mint nft", async () => {
    await coreAssetBuilder.mintNft();
  });

  it("initialize oto", async () => {
    const [mint] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint")],
      program.programId
    );
    const METADATA_SEED = "metadata";
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    const [metadataAddress] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(METADATA_SEED),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    const collection = coreAssetBuilder.getCollectionMint();
    await program.methods
      .initializeOto()
      .accounts({
        payer: authority.publicKey,
        nftCollection: collection.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        metadata: metadataAddress,
      })
      .signers([authority])
      .rpc();
  });

  it("initialize user", async () => {
    await program.methods
      .initializeUser("user_id", user.publicKey)
      .accounts({
        payer: user.publicKey,
      })
      .signers([user])
      .rpc();
  });

  it("update point", async () => {
    await program.methods
      .updatePoint("user_id", new BN(100))
      .accounts({
        admin: authority.publicKey,
      })
      .signers([authority])
      .rpc();
  });

  it("should fail to update point (only admin can update point)", async () => {
    try {
      await program.methods
        .updatePoint("user_id", new BN(100))
        .accounts({ admin: user.publicKey })
        .signers([user])
        .rpc();

      expect.fail();
    } catch {}
  });

  it("claim", async () => {
    await program.methods
      .claim("user_id", new BN(50))
      .accounts({
        beneficiary: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();
  });

  it("should fail to claim (not enough points)", async () => {
    try {
      await program.methods
        .claim("user_id", new BN(100))
        .accounts({ beneficiary: user.publicKey })
        .signers([user])
        .rpc();

      expect.fail();
    } catch {}
  });

  it("should fail to claim (only user can claim)", async () => {
    try {
      await program.methods
        .claim("user_id", new BN(50))
        .accounts({ beneficiary: authority.publicKey })
        .signers([authority])
        .rpc();

      expect.fail();
    } catch {}
  });
});
