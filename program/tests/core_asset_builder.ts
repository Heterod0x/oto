import { AnchorProvider } from "@coral-xyz/anchor";
import { Keypair as Web3Keypair } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  Umi,
  PublicKey,
  generateSigner,
  transactionBuilder,
  keypairIdentity,
  some,
  sol,
  dateTime,
  TransactionBuilderSendAndConfirmOptions,
  publicKey,
  Keypair,
  Signer,
  createSignerFromKeypair,
} from "@metaplex-foundation/umi";
import { createCollectionV1, createV1 } from "@metaplex-foundation/mpl-core";
import {
  fromWeb3JsKeypair,
  toWeb3JsKeypair,
} from "@metaplex-foundation/umi-web3js-adapters";

export class CoreAssetBuilder {
  private umi: Umi;
  private keypair: Keypair;
  private collectionMint: Signer & Keypair;
  private treasury: Signer & Keypair;

  private options: TransactionBuilderSendAndConfirmOptions = {
    send: { skipPreflight: true },
    confirm: { commitment: "processed" },
  };

  constructor(
    private provider: AnchorProvider,
    private authority: Web3Keypair
  ) {
    this.keypair = fromWeb3JsKeypair(authority);

    this.umi = createUmi(provider.connection).use(
      keypairIdentity(this.keypair)
    );

    this.collectionMint = generateSigner(this.umi);
    this.treasury = generateSigner(this.umi);

    console.table({
      keypair: this.keypair.publicKey.toString(),
      collectionMint: this.collectionMint.publicKey.toString(),
      treasury: this.treasury.publicKey.toString(),
    });
  }

  async airdrop(user: Web3Keypair): Promise<void> {
    await this.umi.rpc.airdrop(publicKey(user.publicKey.toString()), sol(1));
  }

  getCollectionMint(): Web3Keypair {
    return toWeb3JsKeypair(this.collectionMint);
  }

  async createCollection(): Promise<void> {
    await createCollectionV1(this.umi, {
      collection: this.collectionMint,
      name: "Oto VAsset Collection",
      uri: "",
      updateAuthority: this.umi.identity.publicKey,
    }).sendAndConfirm(this.umi, this.options);
  }

  async mintNft(): Promise<void> {
    const asset = generateSigner(this.umi);
    await createV1(this.umi, {
      name: "Oto VAsset",
      uri: "",
      asset: asset,
      collection: this.collectionMint.publicKey,
      authority: this.umi.identity,
      updateAuthority: this.umi.identity.publicKey,
    }).sendAndConfirm(this.umi, this.options);
  }
}
