import { AuthTokenClaims, PrivyClient } from "@privy-io/server-auth";
import type { NextApiRequest, NextApiResponse } from "next";

export type APIError = {
  error: string;
  cause?: string;
};

/**
 * Authorizes a user to call an endpoint, returning either an error result or their verifiedClaims
 * @param req - The API request
 * @param res - The API response
 * @param client - A PrivyClient
 */
export const fetchAndVerifyAuthorization = async (
  req: NextApiRequest,
  res: NextApiResponse,
  client: PrivyClient
): Promise<AuthTokenClaims | void> => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Missing auth token." });
  }
  const authToken = header.replace(/^Bearer /, "");

  try {
    return client.verifyAuthToken(authToken);
  } catch {
    return res.status(401).json({ error: "Invalid auth token." });
  }
};

/**
 * Verify an auth token
 * @param authToken - The auth token to verify
 * @returns The verified claims
 */
export const verifyAuthToken = async (authToken: string): Promise<AuthTokenClaims> => {
  const client = createPrivyClient();
  return client.verifyAuthToken(authToken);
};

/**
 * create PrivyClient Instance method
 * @returns 
 */
export const createPrivyClient = () => {
  return new PrivyClient(
    process.env.NEXT_PUBLIC_PRIVY_APP_ID as string,
    process.env.PRIVY_APP_SECRET as string,
    {
      walletApi: {
        authorizationPrivateKey: process.env.SESSION_SIGNER_SECRET,
      },
    }
  );
};
