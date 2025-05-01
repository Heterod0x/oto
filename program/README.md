# Oto Program

Solana program implementation of Oto.

## Overview

- Oto account is a state that stores program-wide info.
  - Core asset collection address is required to initialize the program.
- User account is required for each user to store their point balance.
- Update point is an admin only instruction to update user points.
- Claim is an instruction to convert points to tokens.
- Metaplex Core Asset should be created outside of this program.

## Token

- Name: Oto
- Symbol: OTO
- Decimals: 9

\*You can create a token with the address like `oto...` by creating a keypair with `--starts-with` option.

## Structure

### Accounts

1. Oto Account: Stores program-wide info

   - Admin authority
   - Token mint address
   - Core asset collection address to validate Core assets.

2. User Account: Stores user-specific info

   - User ID (string)
   - Claimable amount (points)
   - Owner

3. VAsset: Stores VAsset info
   - Not implemented yet as we use off-chain program to update points

### Instructions

1. Initialize Oto: Set up the program

2. Initialize User: Create a user account

3. Update Point: Update a user's point balance (admin only)

4. Claim: Convert points to tokens

## Usage

### Prerequisites

- Solana
- Anchor
- Yarn

### Install deps

```bash
yarn install
```

### Build

```bash
anchor build
```

### Deploy

```bash
anchor deploy
```

### Run tests

```bash
anchor test
```

## How to use

### 1. Mint a Core Asset Collection

```typescript
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { keypairIdentity, generateSigner } from "@metaplex-foundation/umi";
import { createCollectionV1, createV1 } from "@metaplex-foundation/mpl-core";
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";

const umi = createUmi(connection).use(
  keypairIdentity(fromWeb3JsKeypair(wallet))
);

// Collection
const collectionMint = generateSigner(umi);
await createCollectionV1(umi, {
  collection: collectionMint,
  name: "Oto VAsset Collection",
  uri: "",
  updateAuthority: umi.identity.publicKey,
}).sendAndConfirm(umi);

// Asset
const asset = generateSigner(umi);
await createV1(umi, {
  name: "Oto VAsset ...",
  uri: "",
  asset: asset,
  collection: collectionMint.publicKey,
  authority: umi.identity,
  updateAuthority: umi.identity.publicKey,
}).sendAndConfirm(umi);
```

### 2. Initialize Oto Program

```typescript
await program.methods
  .initializeOto()
  .accounts({
    payer: wallet.publicKey,
    nftCollection: collectionMint.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    rent: SYSVAR_RENT_PUBKEY,
    tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    metadata: metadataAddress,
  })
  .signers([wallet])
  .rpc();
```

### 3. Initialize User (For each user)

```typescript
await program.methods
  .initializeUser("user_id", userWallet.publicKey)
  .accounts({
    payer: payer.publicKey,
  })
  .signers([payer])
  .rpc();
```

### 4. Update User Points (Admin only)

```typescript
await program.methods
  .updatePoint("user_id", new BN(100))
  .accounts({
    admin: adminWallet.publicKey,
  })
  .signers([adminWallet])
  .rpc();
```

### 5. Claim Tokens

```typescript
await program.methods
  .claim("user_id", new BN(50))
  .accounts({
    beneficiary: userWallet.publicKey,
    tokenProgram: TOKEN_PROGRAM_ID,
    associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .signers([userWallet])
  .rpc();
```
