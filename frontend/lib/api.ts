import { API_BASE_URL } from "./constants";

/**
 * Get conversation history
 * @param userId User ID
 * @returns Conversation history
 */
export async function getConversations(userId: string): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/conversation/?user_id=${encodeURIComponent(userId)}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    console.log("API response:", response);

    return await response.json();
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
}

/**
 * Save conversation
 * @param userId User ID
 * @param audioFile Audio file
 * @returns Save result
 */
export async function storeConversation(
  userId: string,
  audioFile: File
): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("audio", audioFile);

    // Calling the conversation API
    const response = await fetch(`${API_BASE_URL}/conversation/`, {
      method: "POST",
      body: formData,
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    console.log("API response:", response);

    return await response.json();
  } catch (error) {
    console.error("Error storing conversation:", error);
    throw error;
  }
}

/**
 * Get user profile
 * @param userId User ID
 * @returns User profile
 */
export async function getUserProfile(userId: string): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/profile/${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
