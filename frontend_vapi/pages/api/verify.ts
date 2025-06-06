import { AuthTokenClaims } from "@privy-io/server-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifyAuthToken } from "../../lib/privy-server";

export type AuthenticateSuccessResponse = {
  claims: AuthTokenClaims;
};

export type AuthenticationErrorResponse = {
  error: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    AuthenticateSuccessResponse | AuthenticationErrorResponse
  >,
) {
  const headerAuthToken = req.headers.authorization?.replace(/^Bearer /, "");
  const cookieAuthToken = req.cookies["privy-token"];

  const authToken = cookieAuthToken || headerAuthToken;
  if (!authToken) return res.status(401).json({ error: "Missing auth token" });

  try {
    const claims = await verifyAuthToken(authToken);
    return res.status(200).json({ claims });
  } catch (e: any) {
    return res.status(401).json({ error: e.message });
  }
}

export default handler;
