import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { baseSepolia, solana, solanaDevnet, solanaTestnet } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// solana mainnet, testnet, and devnet
export const networks = [solana, solanaTestnet, solanaDevnet, baseSepolia] as [
  AppKitNetwork,
  ...AppKitNetwork[],
];

// Set up Solana Adapter
export const solanaWeb3JsAdapter = new SolanaAdapter();
// Base Adapter
export const ethersAdapter = new EthersAdapter();
