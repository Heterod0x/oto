/**
 * WebSocket Audio Streaming Utilities for Oto API
 */

/**
 * Create alternative headers for testing different auth methods
 */
function createAuthHeaders(apiKey: string, userId: string): HeadersInit {
  // Remove 'Bearer ' prefix if it exists, then add it back
  const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '');
  
  return {
    'Authorization': `Bearer ${cleanApiKey}`,
    'OTO_USER_ID': userId,
    'Content-Type': 'application/json',
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
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    const uuid = crypto.randomUUID();
    console.log("🎲 Generated UUID using crypto.randomUUID():", uuid);
    return uuid;
  }
  
  // Fallback to manual generation
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
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
  type: 'audio' | 'complete';
  data?: string;
}

export interface TranscribeMessage {
  type: 'transcribe';
  data: {
    finalized: boolean;
    transcript: string;
    audioStart: number;
    audioEnd: number;
  };
}

export interface TranscriptBeautifyMessage {
  type: 'transcript-beautify';
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
  type: 'detect-action';
  data: {
    type: 'todo' | 'calendar' | 'research';
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
  apiEndpoint: string
): WebSocket {
  console.log('=== Creating WebSocket Connection (Reference Implementation) ===');
  
  // Validate conversation ID format (must be UUID)
  const isValidUUID = validateUUID(conversationId);
  if (!isValidUUID) {
    console.error('❌ Invalid conversation ID format (must be UUID):', conversationId);
    throw new Error(`Invalid conversation ID format: ${conversationId}`);
  }
  
  // Fix protocol: use wss:// for https endpoints, ws:// for http endpoints  
  let baseUrl = apiEndpoint;
  if (baseUrl.includes("https")) {
    baseUrl = baseUrl.replace('https', 'wss');
  } else {
    baseUrl = baseUrl.replace('http', 'ws');
  }
  
  // Clean API key - remove Bearer prefix and any whitespace
  const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '').trim();
  
  // Try authentication via URL parameters (browsers can't set WebSocket headers)
  const authParams = new URLSearchParams({
    authorization: cleanApiKey,
    user_id: userId
  });
  
  // Build WebSocket URL with auth parameters
  const wsUrl = `${baseUrl}/conversation/${conversationId}/stream?${authParams.toString()}`;
  
  console.log('📋 Conversation ID (UUID):', conversationId);
  console.log('🌐 Base URL:', baseUrl);
  console.log('👤 User ID:', userId);
  console.log('🔗 WebSocket URL (with auth):', wsUrl.replace(cleanApiKey, '*'.repeat(cleanApiKey.length)));
  console.log('🔑 API Key length:', cleanApiKey.length);
  
  try {
    const ws = new WebSocket(wsUrl);
    console.log('✅ WebSocket object created');
    
    // Set up connection event handlers following reference implementation
    ws.addEventListener('open', () => {
      console.log('🔥 WebSocket OPEN event fired');
      console.log('🔍 WebSocket readyState:', ws.readyState);
      console.log('✅ Connection successful');
      
      // Send authentication message as backup (in case URL auth didn't work)
      try {
        const authMessage = {
          type: 'auth',
          data: {
            userId: userId,
            apiKey: cleanApiKey
          }
        };
        ws.send(JSON.stringify(authMessage));
        console.log('📤 Backup authentication message sent:', { type: 'auth', userId, apiKeyLength: cleanApiKey.length });
      } catch (authError) {
        console.error('❌ Failed to send backup authentication message:', authError);
      }
    });
    
    ws.addEventListener('error', (error) => {
      console.error('🔥 WebSocket ERROR event fired:', error);
      console.error('🔍 WebSocket readyState at error:', ws.readyState);
      console.error('🔍 Error details:', {
        type: error.type,
        target: error.target,
        currentTarget: error.currentTarget
      });
    });
    
    ws.addEventListener('close', (event) => {
      console.error('🔥 WebSocket CLOSE event fired:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
      
      // Detailed close code explanations
      const closeReasons = {
        1000: 'Normal closure',
        1001: 'Going away',
        1002: 'Protocol error',
        1003: 'Unsupported data type',
        1005: 'No status received',
        1006: 'Abnormal closure',
        1007: 'Invalid data',
        1008: 'Policy violation',
        1009: 'Message too big',
        1010: 'Extension expected',
        1011: 'Unexpected condition',
        1015: 'TLS handshake failure'
      };
      
      console.error('🔍 Close reason explanation:', closeReasons[event.code] || 'Unknown');
    });
    
    // Store auth info for reference
    (ws as any).authInfo = {
      apiKey: cleanApiKey,
      userId,
      conversationId
    };
    
    return ws;
    
  } catch (error) {
    console.error('Failed to create WebSocket:', error);
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
  apiEndpoint: string
): Promise<WebSocket> {
  return new Promise((resolve, reject) => {
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '').trim();
    const protocol = apiEndpoint.startsWith('https://') ? 'wss://' : 'ws://';
    const baseHost = apiEndpoint.replace(/^https?:\/\//, '');
    
    const strategies = [
      {
        name: 'Subprotocol Authentication',
        url: `${protocol}${baseHost}/conversation/${conversationId}/stream`,
        protocols: [`oto-auth-${cleanApiKey}`, `oto-user-${userId}`]
      },
      {
        name: 'URL Parameters',
        url: `${protocol}${baseHost}/conversation/${conversationId}/stream?authorization=${encodeURIComponent(`Bearer ${cleanApiKey}`)}&oto_user_id=${encodeURIComponent(userId)}`,
        protocols: []
      },
      {
        name: 'Message-based Authentication',
        url: `${protocol}${baseHost}/conversation/${conversationId}/stream`,
        protocols: []
      }
    ];
    
    let currentStrategyIndex = 0;
    
    function tryNextStrategy() {
      if (currentStrategyIndex >= strategies.length) {
        reject(new Error('All WebSocket authentication strategies failed'));
        return;
      }
      
      const strategy = strategies[currentStrategyIndex];
      console.log(`🧪 Trying strategy ${currentStrategyIndex + 1}/${strategies.length}: ${strategy.name}`);
      
      const ws = strategy.protocols.length > 0 
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
      
      ws.addEventListener('open', () => {
        clearTimeout(timeout);
        console.log(`✅ WebSocket connected successfully with ${strategy.name}`);
        
        // Handle message-based auth
        if (strategy.name === 'Message-based Authentication') {
          try {
            const authMessage = {
              type: 'authenticate',
              data: {
                authorization: `Bearer ${cleanApiKey}`,
                user_id: userId,
                conversation_id: conversationId
              }
            };
            ws.send(JSON.stringify(authMessage));
            console.log('📤 Authentication message sent');
          } catch (authError) {
            console.error('❌ Failed to send authentication message:', authError);
          }
        }
        
        // Store strategy info
        (ws as any).authInfo = {
          apiKey: cleanApiKey,
          userId,
          conversationId,
          strategy: strategy.name
        };
        
        resolve(ws);
      });
      
      ws.addEventListener('error', (error) => {
        clearTimeout(timeout);
        console.error(`❌ Strategy "${strategy.name}" failed with error:`, error);
        currentStrategyIndex++;
        setTimeout(tryNextStrategy, 100); // Small delay before next attempt
      });
      
      ws.addEventListener('close', (event) => {
        clearTimeout(timeout);
        if (event.code === 1006 || event.code === 1008) {
          console.warn(`⚠️ Strategy "${strategy.name}" failed with code ${event.code}, trying next...`);
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
      console.warn('ArrayBuffer encoding failed, using FileReader fallback:', error);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix "data:audio/webm;base64,"
        const base64Data = base64.split(',')[1];
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
      type: 'auth',
      data: {
        userId,
        apiKey
      }
    };
    ws.send(JSON.stringify(authMessage));
  }
}

/**
 * Send real-time audio data through WebSocket
 * Handles both Blob and ArrayBuffer data, converts to base64 for transmission
 */
export async function sendRealtimeAudioData(ws: WebSocket, audioData: Blob | ArrayBuffer): Promise<void> {
  if (ws.readyState !== WebSocket.OPEN) {
    console.warn('WebSocket not open, skipping audio data transmission');
    return;
  }

  try {
    let base64Audio: string;

    if (audioData instanceof Blob) {
      // Convert Blob to base64 using the utility function
      base64Audio = await audioBlobToBase64(audioData);
    } else {
      // Convert ArrayBuffer to base64
      base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioData)));
    }

    // Send as JSON message format
    const message = {
      type: 'audio',
      data: base64Audio
    };

    ws.send(JSON.stringify(message));
    console.log(`📤 Audio data sent: ${base64Audio.length} chars`);
  } catch (error) {
    console.error('❌ Failed to send audio data:', error);
  }
}

/**
 * Send audio data as JSON message (fallback method)
 * Format according to API docs: {"type": "audio", "data": "{encoded audio}"}
 */
export function sendAudioData(ws: WebSocket, audioData: string): void {
  if (ws.readyState === WebSocket.OPEN) {
    const message = {
      type: 'audio',
      data: audioData
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
      type: 'complete'
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
    status?: 'active' | 'archived';
    updatedSince?: string;
    limit?: number;
    offset?: number;
  }
): Promise<any[]> {
  try {
    // Build query parameters for the actual API
    const queryParams = new URLSearchParams();
    // Note: Check if user_id is needed as query param for this endpoint
    
    if (options?.status) queryParams.append('status', options.status);
    if (options?.updatedSince) queryParams.append('updated_since', options.updatedSince);
    if (options?.limit) queryParams.append('limit', options.limit.toString());
    if (options?.offset) queryParams.append('offset', options.offset.toString());
    
    // Use the actual API endpoint (plural form)
    const url = `${apiEndpoint}/conversations${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '').trim();
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'OTO_USER_ID': userId,
        'Content-Type': 'application/json',
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
      } else if (data.message && data.message === 'No conversations found') {
        return [];
      }
      
      console.log('Unknown response structure from /conversations:', data);
      return [];
    }
    
    const errorText = await response.text();
    console.error('Failed to fetch conversations:', {
      status: response.status,
      statusText: response.statusText,
      errorText: errorText,
      url: url
    });
    
    return [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
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
  apiEndpoint: string
): Promise<any | null> {
  try {
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '');
    
    const response = await fetch(`${apiEndpoint}/conversation/${conversationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'OTO_USER_ID': userId,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    console.error('Failed to fetch conversation detail:', response.status, response.statusText);
    return null;
  } catch (error) {
    console.error('Error fetching conversation detail:', error);
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
  apiEndpoint: string
): Promise<boolean> {
  try {
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '');
    
    const response = await fetch(`${apiEndpoint}/conversation/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'OTO_USER_ID': userId,
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting conversation:', error);
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
  apiEndpoint: string
): Promise<{ success: boolean; message?: string; conversationId?: string }> {
  console.log("⚠️ Audio upload not supported by this API - only WebSocket streaming is available");
  return { 
    success: false, 
    message: "This API only supports real-time WebSocket streaming, not audio file uploads" 
  };
}

/**
 * Get user profile via API (following reference implementation pattern)
 */
export async function getUserProfile(
  userId: string,
  apiKey: string,
  apiEndpoint: string
): Promise<any | null> {
  try {
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '').trim();
    
    const response = await fetch(`${apiEndpoint}/profile/${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${cleanApiKey}`,
        'accept': 'application/json',
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