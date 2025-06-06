import { getAccessToken } from "@privy-io/react-auth";

/**
 * verifyToken method to check if the user is authenticated (client-side only)
 * @returns 
 */
export async function verifyToken() {
  const url = "/api/verify";
  const accessToken = await getAccessToken();
  const result = await fetch(url, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined),
    },
  });

  return await result.json();
}
