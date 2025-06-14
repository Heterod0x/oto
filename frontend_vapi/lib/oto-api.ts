/**
 * WebSocket Audio Streaming Utilities for Oto API
 */

/**
 * Create alternative headers for testing different auth methods
 */
function createAuthHeaders(apiKey: string, userId: string): HeadersInit {
  // Remove 'Bearer ' prefix if it exists, then add it back
  const cleanApiKey = apiKey.replace(/^Bearer\s+/i, "");

  return {
    Authorization: `Bearer ${cleanApiKey}`,
    OTO_USER_ID: userId,
    "Content-Type": "application/json",
  };
}

/**
 * Validate UUID format (required for conversation ID)
 */
export function validateUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Generate a UUID v4 (RFC 4122 compliant)
 * Required for conversation ID in WebSocket endpoint: /conversation/{conversation_id}/stream
 */
export function generateUUID(): string {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    const uuid = crypto.randomUUID();
    console.log("🎲 Generated UUID using crypto.randomUUID():", uuid);
    return uuid;
  }

  // Fallback to manual generation
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  console.log("🎲 Generated UUID using fallback method:", uuid);

  // Validate UUID format
  const isValidUUID = validateUUID(uuid);
  if (!isValidUUID) {
    console.error("❌ Generated UUID is invalid:", uuid);
    throw new Error("Failed to generate valid UUID");
  }

  return uuid;
}

export interface AudioStreamMessage {
  type: "audio" | "complete";
  data?: string;
}

export interface TranscribeMessage {
  type: "transcribe";
  data: {
    finalized: boolean;
    transcript: string;
    audioStart: number;
    audioEnd: number;
  };
}

export interface TranscriptBeautifyMessage {
  type: "transcript-beautify";
  data: {
    transcript: string;
    audioStart: number;
    audioEnd: number;
    segments: Array<{
      transcript: string;
      audioStart: number;
      audioEnd: number;
    }>;
  };
}

export interface DetectActionMessage {
  type: "detect-action";
  data: {
    type: "todo" | "calendar" | "research";
    id: string;
    inner: {
      title: string;
      body?: string;
      datetime?: string;
      query?: string;
    };
    relate: {
      start: number;
      end: number;
      transcript: string;
    };
  };
}

export type WebSocketMessage = TranscribeMessage | TranscriptBeautifyMessage | DetectActionMessage;

/**
 * Create WebSocket connection for audio streaming
 * Based on reference implementation from Heterod0x/oto
 * Endpoint: /conversation/{conversation_id}/stream
 * conversation_id must be a valid UUID
 */
export function createAudioWebSocket(
  conversationId: string,
  userId: string,
  apiKey: string,
  apiEndpoint: string,
): WebSocket {
  console.log("=== Creating WebSocket Connection (Reference Implementation) ===");

  // Validate conversation ID format (must be UUID)
  const isValidUUID = validateUUID(conversationId);
  if (!isValidUUID) {
    console.error("❌ Invalid conversation ID format (must be UUID):", conversationId);
    throw new Error(`Invalid conversation ID format: ${conversationId}`);
  }

  // Fix protocol: use wss:// for https endpoints, ws:// for http endpoints
  let baseUrl = apiEndpoint;
  if (baseUrl.includes("https")) {
    baseUrl = baseUrl.replace("https", "wss");
  } else {
    baseUrl = baseUrl.replace("http", "ws");
  }

  // Clean API key - remove Bearer prefix and any whitespace
  const cleanApiKey = apiKey.replace(/^Bearer\s+/i, "").trim();

  // Simple WebSocket URL without auth parameters (following reference implementation)
  const wsUrl = `${baseUrl}/conversation/${conversationId}/stream`;

  console.log("📋 Conversation ID (UUID):", conversationId);
  console.log("🌐 Base URL:", baseUrl);
  console.log("👤 User ID:", userId);
  console.log("🔗 Simple WebSocket URL:", wsUrl);
  console.log("🔑 API Key length:", cleanApiKey.length);

  try {
    const ws = new WebSocket(wsUrl);
    console.log("✅ WebSocket object created");

    // Set up connection event handlers following reference implementation
    ws.addEventListener("open", () => {
      console.log("🔥 WebSocket OPEN event fired");
      console.log("🔍 WebSocket readyState:", ws.readyState);
      console.log("✅ Connection successful");

      // Reset audio stats for new session
      resetAudioStats();

      // Send authentication message as backup (in case URL auth didn't work)
      try {
        const authMessage = {
          type: "auth",
          data: {
            userId: userId,
            apiKey: cleanApiKey,
          },
        };
        ws.send(JSON.stringify(authMessage));
        console.log("📤 Backup authentication message sent:", {
          type: "auth",
          userId,
          apiKeyLength: cleanApiKey.length,
        });
      } catch (authError) {
        console.error("❌ Failed to send backup authentication message:", authError);
      }
    });

    ws.addEventListener("message", (event) => {
      console.log("📥 WebSocket MESSAGE received:", {
        timestamp: new Date().toISOString(),
        dataType: typeof event.data,
        dataLength: event.data?.length || 0,
        rawData: event.data,
      });

      try {
        // Try to parse as JSON
        const parsedData = JSON.parse(event.data);
        console.log("📄 Parsed WebSocket message:", {
          type: parsedData.type,
          dataKeys: Object.keys(parsedData),
          fullMessage: parsedData,
        });
        // Handle different message types
        switch (parsedData.type) {
          case "transcribe":
            console.log("🎤 Transcription received:", {
              finalized: parsedData.data?.finalized,
              transcript: parsedData.data?.transcript,
              audioStart: parsedData.data?.audioStart,
              audioEnd: parsedData.data?.audioEnd,
              transcriptLength: parsedData.data?.transcript?.length || 0,
            });
            break;
          case "transcript-beautify":
            console.log("✨ Beautified transcript received:", {
              transcript: parsedData.data?.transcript,
              segmentsCount: parsedData.data?.segments?.length || 0,
              transcriptLength: parsedData.data?.transcript?.length || 0,
              segments: parsedData.data?.segments,
            });
            break;
          case "detect-action":
            console.log("🎯 Action detected:", {
              actionType: parsedData.data?.type,
              actionId: parsedData.data?.id,
              title: parsedData.data?.inner?.title,
              body: parsedData.data?.inner?.body,
              datetime: parsedData.data?.inner?.datetime,
              relatedTranscript: parsedData.data?.relate?.transcript,
            });
            break;
          case "auth":
          case "auth_success":
          case "authentication_successful":
            console.log("🔑 Authentication response:", {
              type: parsedData.type,
              success: true,
              message: parsedData.message || "Authentication successful",
            });
            break;
          case "error":
          case "auth_failed":
          case "authentication_failed":
            console.error("❌ Server error received:", {
              type: parsedData.type,
              error: parsedData.error || parsedData.message,
              code: parsedData.code,
              details: parsedData.details,
              fullMessage: parsedData,
            });
            break;
          case "ping":
            console.log("🏓 Ping received from server");
            break;
          case "pong":
            console.log("🏓 Pong received from server");
            break;
          default:
            console.log("❓ Unknown message type received:", {
              type: parsedData.type,
              hasData: !!parsedData.data,
              messageKeys: Object.keys(parsedData),
              fullMessage: parsedData,
            });
        }
      } catch (parseError) {
        console.log("📄 Non-JSON WebSocket message received:", {
          rawMessage: event.data,
          parseError: parseError.message,
        });
      }
    });

    ws.addEventListener("error", (error) => {
      console.error("🔥 WebSocket ERROR event fired:", error);
      console.error("🔍 WebSocket readyState at error:", ws.readyState);
      console.error("🔍 Error details:", {
        type: error.type,
        target: error.target,
        currentTarget: error.currentTarget,
      });
    });

    ws.addEventListener("close", (event) => {
      console.error("🔥 WebSocket CLOSE event fired:", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });

      // Detailed close code explanations
      const closeReasons = {
        1000: "Normal closure",
        1001: "Going away",
        1002: "Protocol error",
        1003: "Unsupported data type",
        1005: "No status received",
        1006: "Abnormal closure",
        1007: "Invalid data",
        1008: "Policy violation",
        1009: "Message too big",
        1010: "Extension expected",
        1011: "Unexpected condition",
        1015: "TLS handshake failure",
      };

      console.error("🔍 Close reason explanation:", closeReasons[event.code] || "Unknown");
    });

    // Store auth info for reference
    (ws as any).authInfo = {
      apiKey: cleanApiKey,
      userId,
      conversationId,
    };

    return ws;
  } catch (error) {
    console.error("Failed to create WebSocket:", error);
    throw error;
  }
}

/**
 * Create WebSocket connection with fallback strategies
 * This function tries multiple authentication methods
 */
export function createAudioWebSocketWithFallback(
  conversationId: string,
  userId: string,
  apiKey: string,
  apiEndpoint: string,
): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, "").trim();
    const protocol = apiEndpoint.startsWith("https://") ? "wss://" : "ws://";
    const baseHost = apiEndpoint.replace(/^https?:\/\//, "");

    const strategies = [
      {
        name: "Subprotocol Authentication",
        url: `${protocol}${baseHost}/conversation/${conversationId}/stream`,
        protocols: [`oto-auth-${cleanApiKey}`, `oto-user-${userId}`],
      },
      {
        name: "URL Parameters",
        url: `${protocol}${baseHost}/conversation/${conversationId}/stream?authorization=${encodeURIComponent(`Bearer ${cleanApiKey}`)}&oto_user_id=${encodeURIComponent(userId)}`,
        protocols: [],
      },
      {
        name: "Message-based Authentication",
        url: `${protocol}${baseHost}/conversation/${conversationId}/stream`,
        protocols: [],
      },
    ];

    let currentStrategyIndex = 0;

    function tryNextStrategy() {
      if (currentStrategyIndex >= strategies.length) {
        reject(new Error("All WebSocket authentication strategies failed"));
        return;
      }

      const strategy = strategies[currentStrategyIndex];
      console.log(
        `🧪 Trying strategy ${currentStrategyIndex + 1}/${strategies.length}: ${strategy.name}`,
      );

      const ws =
        strategy.protocols.length > 0
          ? new WebSocket(strategy.url, strategy.protocols)
          : new WebSocket(strategy.url);

      const timeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.warn(`⏰ Strategy "${strategy.name}" timed out, trying next...`);
          ws.close();
          currentStrategyIndex++;
          tryNextStrategy();
        }
      }, 5000); // 5 second timeout

      ws.addEventListener("open", () => {
        clearTimeout(timeout);
        console.log(`✅ WebSocket connected successfully with ${strategy.name}`);

        // Handle message-based auth
        if (strategy.name === "Message-based Authentication") {
          try {
            const authMessage = {
              type: "authenticate",
              data: {
                authorization: `Bearer ${cleanApiKey}`,
                user_id: userId,
                conversation_id: conversationId,
              },
            };
            ws.send(JSON.stringify(authMessage));
            console.log("📤 Authentication message sent");
          } catch (authError) {
            console.error("❌ Failed to send authentication message:", authError);
          }
        }

        // Store strategy info
        (ws as any).authInfo = {
          apiKey: cleanApiKey,
          userId,
          conversationId,
          strategy: strategy.name,
        };

        resolve(ws);
      });

      ws.addEventListener("error", (error) => {
        clearTimeout(timeout);
        console.error(`❌ Strategy "${strategy.name}" failed with error:`, error);
        currentStrategyIndex++;
        setTimeout(tryNextStrategy, 100); // Small delay before next attempt
      });

      ws.addEventListener("close", (event) => {
        clearTimeout(timeout);
        if (event.code === 1006 || event.code === 1008) {
          console.warn(
            `⚠️ Strategy "${strategy.name}" failed with code ${event.code}, trying next...`,
          );
          currentStrategyIndex++;
          setTimeout(tryNextStrategy, 100);
        }
      });
    }

    tryNextStrategy();
  });
}
/**
 * Convert audio blob to base64 for WebSocket transmission
 * Following reference implementation pattern for audio encoding
 */
export function audioBlobToBase64(blob: Blob): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // Use ArrayBuffer approach like reference implementation
      const arrayBuffer = await blob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      resolve(base64Audio);
    } catch (error) {
      // Fallback to original method
      console.warn("ArrayBuffer encoding failed, using FileReader fallback:", error);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix "data:audio/webm;base64,"
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }
  });
}

/**
 * Send authentication message through WebSocket
 * Some WebSocket implementations require auth to be sent as first message
 */
export function sendAuthMessage(ws: WebSocket, userId: string, apiKey: string): void {
  if (ws.readyState === WebSocket.OPEN) {
    const authMessage = {
      type: "auth",
      data: {
        userId,
        apiKey,
      },
    };
    ws.send(JSON.stringify(authMessage));
  }
}

// Global audio statistics for debugging
let audioStatsCounter = {
  totalChunks: 0,
  totalBytes: 0,
  totalBase64Bytes: 0,
  startTime: Date.now(),
  lastChunkTime: Date.now(),
};

/**
 * Send real-time audio data through WebSocket
 * Handles both Blob and ArrayBuffer data, trying different formats for compatibility
 * Enhanced with detailed logging and statistics tracking
 */
export async function sendRealtimeAudioData(
  ws: WebSocket,
  audioData: Blob | ArrayBuffer,
  useBinaryMode: boolean = true
): Promise<void> {
  if (ws.readyState !== WebSocket.OPEN) {
    console.warn(
      "⚠️ WebSocket not open, skipping audio data transmission. ReadyState:",
      ws.readyState,
    );
    return;
  }

  try {
    const chunkStartTime = performance.now();
    let audioSize: number;
    let audioType: string;

    if (audioData instanceof Blob) {
      audioSize = audioData.size;
      audioType = audioData.type || "unknown";
      
      console.log(`🎵 Audio Blob received:`, {
        size: audioSize,
        type: audioType,
        sendMode: useBinaryMode ? "binary" : "base64-json"
      });

      if (useBinaryMode) {
        // Try sending raw binary data directly
        const arrayBuffer = await audioData.arrayBuffer();
        const sendStartTime = performance.now();
        ws.send(arrayBuffer);
        const sendTime = performance.now() - sendStartTime;

        // Update statistics
        audioStatsCounter.totalChunks++;
        audioStatsCounter.totalBytes += audioSize;
        
        console.log(`📤 Binary audio chunk #${audioStatsCounter.totalChunks} sent:`, {
          chunkNumber: audioStatsCounter.totalChunks,
          originalSize: audioSize,
          sendTime: `${sendTime.toFixed(2)}ms`,
          wsBufferedAmount: ws.bufferedAmount
        });
        
        return;
      }
    } else {
      audioSize = audioData.byteLength;
      audioType = "ArrayBuffer";
      
      if (useBinaryMode) {
        const sendStartTime = performance.now();
        ws.send(audioData);
        const sendTime = performance.now() - sendStartTime;

        // Update statistics
        audioStatsCounter.totalChunks++;
        audioStatsCounter.totalBytes += audioSize;
        
        console.log(`📤 Binary ArrayBuffer chunk #${audioStatsCounter.totalChunks} sent:`, {
          chunkNumber: audioStatsCounter.totalChunks,
          byteLength: audioSize,
          sendTime: `${sendTime.toFixed(2)}ms`,
          wsBufferedAmount: ws.bufferedAmount
        });
        
        return;
      }
    }

    // Fallback to JSON mode if not using binary
    let base64Audio: string;
    
    if (audioData instanceof Blob) {
      base64Audio = await audioBlobToBase64(audioData);
    } else {
      base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioData)));
    }

    // Update global statistics
    audioStatsCounter.totalChunks++;
    audioStatsCounter.totalBytes += audioSize;
    audioStatsCounter.totalBase64Bytes += base64Audio.length;
    const currentTime = Date.now();
    const timeSinceLastChunk = currentTime - audioStatsCounter.lastChunkTime;
    audioStatsCounter.lastChunkTime = currentTime;

    // Send as JSON message format
    const message = {
      type: "audio",
      data: base64Audio,
    };

    const messageJson = JSON.stringify(message);
    const sendStartTime = performance.now();
    ws.send(messageJson);
    const sendTime = performance.now() - sendStartTime;

    // Calculate statistics for JSON mode
    const totalRuntime = (currentTime - audioStatsCounter.startTime) / 1000; // seconds
    const avgChunkSize = audioStatsCounter.totalBytes / audioStatsCounter.totalChunks;
    const avgBase64Size = audioStatsCounter.totalBase64Bytes / audioStatsCounter.totalChunks;
    const chunksPerSecond = audioStatsCounter.totalChunks / totalRuntime;
    const bytesPerSecond = audioStatsCounter.totalBytes / totalRuntime;

    console.log(`📤 JSON audio chunk #${audioStatsCounter.totalChunks} sent to WebSocket:`, {
      // Current chunk info
      chunkNumber: audioStatsCounter.totalChunks,
      originalSize: audioSize,
      base64Size: base64Audio.length,
      jsonSize: messageJson.length,
      base64Preview:
        base64Audio.substring(0, 30) + "..." + base64Audio.substring(base64Audio.length - 20),

      // Timing info
      timestamp: new Date().toISOString(),
      timeSinceLastChunk: `${timeSinceLastChunk}ms`,
      processingTime: `${(performance.now() - chunkStartTime).toFixed(2)}ms`,
      sendTime: `${sendTime.toFixed(2)}ms`,

      // Cumulative statistics
      totalRuntime: `${totalRuntime.toFixed(1)}s`,
      avgChunkSize: `${avgChunkSize.toFixed(0)} bytes`,
      avgBase64Size: `${avgBase64Size.toFixed(0)} chars`,
      chunksPerSecond: chunksPerSecond.toFixed(2),
      bytesPerSecond: `${(bytesPerSecond / 1024).toFixed(2)} KB/s`,
      totalDataSent: `${(audioStatsCounter.totalBytes / 1024).toFixed(2)} KB`,

      // WebSocket state
      wsReadyState: ws.readyState,
      wsBufferedAmount: ws.bufferedAmount,
    });

    // Log detailed statistics every 10 chunks
    if (audioStatsCounter.totalChunks % 10 === 0) {
      console.log(`📊 Audio Streaming Statistics (${audioStatsCounter.totalChunks} chunks):`, {
        totalChunks: audioStatsCounter.totalChunks,
        totalDataSent: `${(audioStatsCounter.totalBytes / 1024).toFixed(2)} KB`,
        totalBase64Sent: `${(audioStatsCounter.totalBase64Bytes / 1024).toFixed(2)} KB`,
        averageChunkSize: `${avgChunkSize.toFixed(0)} bytes`,
        compressionRatio: `${((audioStatsCounter.totalBase64Bytes / audioStatsCounter.totalBytes) * 100).toFixed(1)}%`,
        streamingRate: `${chunksPerSecond.toFixed(2)} chunks/sec`,
        bandwidthUsage: `${(bytesPerSecond / 1024).toFixed(2)} KB/s`,
        runtime: `${totalRuntime.toFixed(1)}s`,
        wsBufferedAmount: `${ws.bufferedAmount} bytes`,
      });
    }
  } catch (error) {
    console.error(
      "❌ Failed to send audio data (chunk #" + (audioStatsCounter.totalChunks + 1) + "):",
      error,
    );
    console.error("🔍 Error details:", {
      errorName: error.name,
      errorMessage: error.message,
      wsReadyState: ws.readyState,
      audioDataType: audioData.constructor.name,
      audioDataSize: audioData instanceof Blob ? audioData.size : audioData.byteLength,
    });
  }
}

/**
 * Reset audio statistics counter (useful for new recording sessions)
 */
export function resetAudioStats(): void {
  audioStatsCounter = {
    totalChunks: 0,
    totalBytes: 0,
    totalBase64Bytes: 0,
    startTime: Date.now(),
    lastChunkTime: Date.now(),
  };
  console.log("📊 Audio statistics reset for new session");
}

/**
 * Get current audio streaming statistics
 */
export function getAudioStats() {
  const currentTime = Date.now();
  const totalRuntime = (currentTime - audioStatsCounter.startTime) / 1000;
  const avgChunkSize =
    audioStatsCounter.totalChunks > 0
      ? audioStatsCounter.totalBytes / audioStatsCounter.totalChunks
      : 0;
  const chunksPerSecond = totalRuntime > 0 ? audioStatsCounter.totalChunks / totalRuntime : 0;
  const bytesPerSecond = totalRuntime > 0 ? audioStatsCounter.totalBytes / totalRuntime : 0;

  return {
    totalChunks: audioStatsCounter.totalChunks,
    totalBytes: audioStatsCounter.totalBytes,
    totalBase64Bytes: audioStatsCounter.totalBase64Bytes,
    avgChunkSize: Math.round(avgChunkSize),
    chunksPerSecond: Math.round(chunksPerSecond * 100) / 100,
    bytesPerSecond: Math.round(bytesPerSecond),
    runtime: Math.round(totalRuntime * 10) / 10,
    compressionRatio:
      audioStatsCounter.totalBytes > 0
        ? Math.round((audioStatsCounter.totalBase64Bytes / audioStatsCounter.totalBytes) * 1000) /
          10
        : 0,
  };
}

/**
 * Send audio data as JSON message (fallback method)
 * Format according to API docs: {"type": "audio", "data": "{encoded audio}"}
 */
export function sendAudioData(ws: WebSocket, audioData: string): void {
  if (ws.readyState === WebSocket.OPEN) {
    const message = {
      type: "audio",
      data: audioData,
    };
    ws.send(JSON.stringify(message));
  }
}

/**
 * Send completion signal through WebSocket
 * Format according to API docs: {"type": "complete"}
 */
export function sendCompleteSignal(ws: WebSocket): void {
  if (ws.readyState === WebSocket.OPEN) {
    const message = {
      type: "complete",
    };
    ws.send(JSON.stringify(message));
  }
}

// Note: createConversation function removed - backend doesn't support JSON conversation creation
// Backend only supports: POST /conversation/ with form-data (audio upload)
// We generate UUID locally for WebSocket connection instead

/**
 * Get conversation list via API
 * Backend endpoint: GET /conversations (note: plural form)
 */
export async function getConversations(
  userId: string,
  apiKey: string,
  apiEndpoint: string,
  options?: {
    status?: "active" | "archived";
    updatedSince?: string;
    limit?: number;
    offset?: number;
  },
): Promise<any[]> {
  try {
    // Build query parameters for the actual API
    const queryParams = new URLSearchParams();
    // Note: Check if user_id is needed as query param for this endpoint

    if (options?.status) queryParams.append("status", options.status);
    if (options?.updatedSince) queryParams.append("updated_since", options.updatedSince);
    if (options?.limit) queryParams.append("limit", options.limit.toString());
    if (options?.offset) queryParams.append("offset", options.offset.toString());

    // Use the actual API endpoint (plural form)
    const url = `${apiEndpoint}/conversations${queryParams.toString() ? "?" + queryParams.toString() : ""}`;

    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, "").trim();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanApiKey}`,
        OTO_USER_ID: userId,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();

      // Handle response structure from actual API
      if (Array.isArray(data)) {
        return data;
      } else if (data.conversations && Array.isArray(data.conversations)) {
        return data.conversations;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.message && data.message === "No conversations found") {
        return [];
      }

      console.log("Unknown response structure from /conversations:", data);
      return [];
    }

    const errorText = await response.text();
    console.error("Failed to fetch conversations:", {
      status: response.status,
      statusText: response.statusText,
      errorText: errorText,
      url: url,
    });

    return [];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
}

/**
 * Get conversation detail via API
 * Endpoint: /conversation/{id}
 */
export async function getConversationDetail(
  conversationId: string,
  userId: string,
  apiKey: string,
  apiEndpoint: string,
): Promise<any | null> {
  try {
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, "");

    const response = await fetch(`${apiEndpoint}/conversation/${conversationId}/transcript`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanApiKey}`,
        OTO_USER_ID: userId,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return await response.json();
    }

    console.error("Failed to fetch conversation detail:", response.status, response.statusText);
    return null;
  } catch (error) {
    console.error("Error fetching conversation detail:", error);
    return null;
  }
}

/**
 * Delete conversation via API
 * Endpoint: /conversation/{id}
 */
export async function deleteConversation(
  conversationId: string,
  userId: string,
  apiKey: string,
  apiEndpoint: string,
): Promise<boolean> {
  try {
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, "");

    const response = await fetch(`${apiEndpoint}/conversation/${conversationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${cleanApiKey}`,
        OTO_USER_ID: userId,
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return false;
  }
}

/**
 * Store conversation audio via API (DEPRECATED - API doesn't support audio upload)
 * This API only supports WebSocket streaming, not file uploads
 */
export async function storeConversationAudio(
  userId: string,
  audioFile: File,
  apiKey: string,
  apiEndpoint: string,
): Promise<{ success: boolean; message?: string; conversationId?: string }> {
  console.log("⚠️ Audio upload not supported by this API - only WebSocket streaming is available");
  return {
    success: false,
    message: "This API only supports real-time WebSocket streaming, not audio file uploads",
  };
}

/**
 * Get user profile via API (following reference implementation pattern)
 */
export async function getUserProfile(
  userId: string,
  apiKey: string,
  apiEndpoint: string,
): Promise<any | null> {
  try {
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, "").trim();

    const response = await fetch(`${apiEndpoint}/profile/${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanApiKey}`,
        accept: "application/json",
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to fetch user profile:", response.status, response.statusText);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

/**
 * Action types from the API response
 */
export interface ActionResponse {
  type: "todo" | "calendar" | "research";
  created_at: string;
  updated_at: string;
  status: "created" | "accepted" | "deleted" | "completed";
  id: string;
  conversation_id: string;
  inner: {
    title: string;
    body?: string;
    datetime?: string;
    query?: string;
  };
  relate: {
    start: number;
    end: number;
    transcript: string;
  };
}

export interface ActionsApiResponse {
  actions: ActionResponse[];
}

/**
 * Get actions (tasks) from API
 * Endpoint: GET /actions
 */
export async function getActions(
  userId: string,
  apiKey: string,
  apiEndpoint: string,
  options?: {
    conversation_id?: string;
    status?: "created" | "accepted" | "deleted" | "completed";
    type?: "todo" | "calendar" | "research";
  },
): Promise<ActionResponse[]> {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (options?.conversation_id) queryParams.append("conversation_id", options.conversation_id);
    if (options?.status) queryParams.append("status", options.status);
    if (options?.type) queryParams.append("type", options.type);

    // Use the actual API endpoint
    const url = `${apiEndpoint}/actions${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
    
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, "").trim();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanApiKey}`,
        OTO_USER_ID: userId,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data: ActionsApiResponse = await response.json();
      
      // Return the actions array
      return data.actions || [];
    }

    const errorText = await response.text();
    console.error("Failed to fetch actions:", {
      status: response.status,
      statusText: response.statusText,
      errorText: errorText,
      url: url,
    });

    return [];
  } catch (error) {
    console.error("Error fetching actions:", error);
    return [];
  }
}
