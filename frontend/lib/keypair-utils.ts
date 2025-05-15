import { PublicKey } from "@solana/web3.js";

/**
 * Convert the secret key array read from environment variables to Uint8Array
 * @param secretKeyString A string representing a comma-separated secret key array
 * @returns Secret key in Uint8Array format
 */
export function parseSecretKey(secretKeyString: string): Uint8Array {
  try {
    // Convert comma-separated string to number array
    const secretKeyArray = secretKeyString.split(",").map((num) => parseInt(num.trim(), 10));

    // Convert number array to Uint8Array
    return new Uint8Array(secretKeyArray);
  } catch (error) {
    console.error("Failed to parse secret key:", error);
    throw new Error("Invalid secret key format");
  }
}

/**
 * Get asset keypair information from environment variables
 * @returns Asset keypair information (publicKey and secretKey)
 */
export function getAssetKeypair(): { publicKey: string; secretKey: Uint8Array } {
  // Get keypair information from environment variables
  const publicKey = process.env.NEXT_PUBLIC_ASSET_PUBLIC_KEY;
  const secretKeyString = process.env.ASSET_SECRET_KEY;

  if (!publicKey || !secretKeyString) {
    throw new Error("Asset keypair environment variables are not set");
  }

  // Parse private key and convert to Uint8Array
  const secretKey = parseSecretKey(secretKeyString);

  return {
    publicKey,
    secretKey,
  };
}

/**
 * Get asset PublicKey object from environment variables
 * @returns PublicKey object
 */
export function getAssetPublicKey(): PublicKey {
  const publicKeyString = process.env.NEXT_PUBLIC_ASSET_PUBLIC_KEY;

  if (!publicKeyString) {
    throw new Error("Asset public key environment variable is not set");
  }

  return new PublicKey(publicKeyString);
}
