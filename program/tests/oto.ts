import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { Oto } from "../target/types/oto";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { CoreAssetBuilder } from "./core_asset_builder";
import { expect } from "chai";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import nacl from "tweetnacl";

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

  // Token Mint
  const [mint] = PublicKey.findProgramAddressSync(
    [Buffer.from("mint")],
    program.programId
  );

  it("airdrop", async () => {
    // transfer sol to authority instead of airdrop
    try {
      const transfer = SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: authority.publicKey,
        lamports: LAMPORTS_PER_SOL,
      });
      const tx = new Transaction().add(transfer);
      await provider.sendAndConfirm(tx);

      const transfer2 = SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: user.publicKey,
        lamports: LAMPORTS_PER_SOL,
      });
      const tx2 = new Transaction().add(transfer2);
      await provider.sendAndConfirm(tx2);
    } catch (e) {
      console.log(e);
    }
  });

  it("create collection", async () => {
    await coreAssetBuilder.createCollection();
  });

  it("mint nft", async () => {
    await coreAssetBuilder.mintNft();
  });

  it("initialize oto", async () => {
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

  it("mint oto", async () => {
    await program.methods
      .mintOto(new BN(50))
      .accounts({
        beneficiary: user.publicKey,
        payer: authority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user, authority])
      .rpc();

    // check token balance
    const ata = await getAssociatedTokenAddress(mint, user.publicKey);
    const tokenBalance = await provider.connection.getTokenAccountBalance(ata);
    expect(tokenBalance.value.amount).to.be.equal("50");
  });

  it("initialize user", async () => {
    await program.methods
      .initializeUser("user_id", user.publicKey)
      .accounts({
        payer: authority.publicKey,
      })
      .signers([authority])
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
        payer: authority.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user, authority])
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

  // ================================
  // storage
  // ================================

  const dummyFile = Buffer.from("audio-bytes-here");
  const fileHash = nacl.hash(dummyFile).slice(0, 32);

  const [assetPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("asset"), user.publicKey.toBuffer(), fileHash],
    program.programId
  );

  it("user register asset", async () => {
    await program.methods
      .registerAsset([...fileHash], 20250102, 0)
      .accounts({
        user: user.publicKey,
      })
      .signers([user])
      .rpc();
  });

  const buyer = anchor.web3.Keypair.generate();
  const relayer = anchor.web3.Keypair.generate();

  it("airdrop for storage", async () => {
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: buyer.publicKey,
        lamports: LAMPORTS_PER_SOL,
      })
    );
    await provider.sendAndConfirm(tx);

    const tx2 = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: relayer.publicKey,
        lamports: LAMPORTS_PER_SOL,
      })
    );
    await provider.sendAndConfirm(tx2);
  });

  it("create user for buyer", async () => {
    await program.methods
      .initializeUser("buyer_account", buyer.publicKey)
      .accounts({
        payer: buyer.publicKey,
      })
      .signers([buyer])
      .rpc();
  });

  it("give token to buyer", async () => {
    await program.methods
      .updatePoint("buyer_account", new BN(100))
      .accounts({
        admin: authority.publicKey,
      })
      .signers([authority])
      .rpc();
  });

  it("claim token by buyer", async () => {
    await program.methods
      .claim("buyer_account", new BN(100))
      .accounts({
        beneficiary: buyer.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([buyer])
      .rpc();
  });

  const [purchaseRequest] = PublicKey.findProgramAddressSync(
    [Buffer.from("purchase"), buyer.publicKey.toBuffer(), Buffer.from([0])],
    program.programId
  );

  it("register purchase request", async () => {
    await program.methods
      .registerPurchaseRequest({
        buyerPubkey: buyer.publicKey,
        filterLanguage: 0,
        startDate: 20250101,
        endDate: 20250102,
        unitPrice: new BN(100),
        maxBudget: new BN(100),
        nonce: 0,
      })
      .accounts({
        buyer: buyer.publicKey,
        purchaseRequest: purchaseRequest,
      })
      .signers([buyer])
      .rpc();

    const pr = await program.account.purchaseRequest.fetch(purchaseRequest);
    expect(pr.buyerPubkey.equals(buyer.publicKey)).to.be.true;
    expect(pr.filterLanguage).to.be.equal(0);
    expect(pr.startDate).to.be.equal(20250101);
    expect(pr.endDate).to.be.equal(20250102);
    expect(pr.unitPrice.toNumber()).to.be.equal(100);
    expect(pr.budgetRemaining.toNumber()).to.be.equal(100);
  });

  const [offerPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("offer"), purchaseRequest.toBuffer(), fileHash],
    program.programId
  );

  it("apply asset offer", async () => {
    await program.methods
      .applyAssetOffer()
      .accounts({
        purchaseRequest: purchaseRequest,
        assetMetadata: assetPda,
        provider: user.publicKey,
      })
      .signers([user])
      .rpc();
  });

  it("submit transfer proof", async () => {
    // must be 64 bytes
    const buyerSigDummy = Buffer.alloc(64);
    await program.methods
      .submitTransferProof([...fileHash], [...buyerSigDummy])
      .accounts({
        relayer: relayer.publicKey,
        purchaseRequest: purchaseRequest,
        provider: user.publicKey,
        assetOffer: offerPda,
      })
      .signers([relayer])
      .rpc();

    const pr = await program.account.purchaseRequest.fetch(purchaseRequest);
    expect(pr.budgetRemaining.toNumber()).to.be.equal(0);

    // get token balance for `mint`
    const ata = await getAssociatedTokenAddress(mint, user.publicKey);
    const tokenBalance = await provider.connection.getTokenAccountBalance(ata);
    expect(tokenBalance.value.amount).to.be.equal("200"); // minted-on-mint-oto + pre-claimed-on-basic-claim + claimed-on-proof
  });
});
