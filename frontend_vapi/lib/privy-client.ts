import { getAccessToken } from "@privy-io/react-auth";

/**
 * verifyToken method to check if the user is authenticated (client-side only)
 * @returns Access token if available, null otherwise
 */
export async function verifyToken() {
  try {
    const accessToken = await getAccessToken();
    return accessToken ? { token: accessToken } : null;
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
}
