import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { base, baseSepolia } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// solana mainnet, testnet, and devnet
export const networks = [baseSepolia, base] as [AppKitNetwork, ...AppKitNetwork[]];

// Base Adapter
export const ethersAdapter = new EthersAdapter();
