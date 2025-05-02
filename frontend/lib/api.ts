import { API_BASE_URL } from "./constants";

/**
 * 会話履歴を取得する
 * @param userId ユーザーID
 * @returns 会話履歴
 */
export async function getConversations(userId: string): Promise<any> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/conversation/?user_id=${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
}

/**
 * 会話を保存する
 * @param userId ユーザーID
 * @param audioFile 音声ファイル
 * @returns 保存結果
 */
export async function storeConversation(userId: string, audioFile: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("audio", audioFile);

    // conversation APIの呼び出し
    const response = await fetch(`${API_BASE_URL}/conversation/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error storing conversation:", error);
    throw error;
  }
}

/**
 * ユーザープロファイルを取得する
 * @param userId ユーザーID
 * @returns ユーザープロファイル
 */
export async function getUserProfile(userId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
