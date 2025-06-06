import { AuthTokenClaims } from "@privy-io/server-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuthToken } from "./privy-server";

export type APIError = {
  error: string;
  cause?: string;
};

/**
 * Authorizes a user to call an endpoint, returning either an error result or their verifiedClaims
 * @param req - The API request
 * @param res - The API response
 * @param client - A PrivyClient (optional, uses default if not provided)
 */
export const fetchAndVerifyAuthorization = async (
  req: NextApiRequest,
  res: NextApiResponse,
  client?: any
): Promise<AuthTokenClaims | void> => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: "Missing auth token." });
  }
  const authToken = header.replace(/^Bearer /, "");

  try {
    return await verifyAuthToken(authToken);
  } catch {
    return res.status(401).json({ error: "Invalid auth token." });
  }
};

export { createPrivyClient } from "./privy-server";
