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
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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
 * Based on API documentation: /conversation/{conversation_id}/stream
 * Try simple connection first, then auth via message
 */
export function createAudioWebSocket(
  conversationId: string,
  userId: string,
  apiKey: string,
  apiEndpoint: string
): WebSocket {
  // Fix protocol: use wss:// for https endpoints, ws:// for http endpoints  
  const protocol = apiEndpoint.startsWith('https://') ? 'wss://' : 'ws://';
  
  // Clean API key - remove Bearer prefix and any whitespace
  const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '').trim();
  
  // Try URL with authentication parameters - use different parameter names
  const baseHost = apiEndpoint.replace(/^https?:\/\//, '');
  
  // Try different auth parameter formats
  const authParams = [
    `api_key=${encodeURIComponent(cleanApiKey)}&user_id=${encodeURIComponent(userId)}`,
    `authorization=${encodeURIComponent(cleanApiKey)}&user_id=${encodeURIComponent(userId)}`,
    `token=${encodeURIComponent(cleanApiKey)}&user=${encodeURIComponent(userId)}`,
  ];
  
  // Use the first format initially
  const wsUrlWithAuth = `${protocol}${baseHost}/conversation/${conversationId}/stream`;
  
  console.log('=== WebSocket Connection Debug ===');
  console.log('Original endpoint:', apiEndpoint);
  console.log('Detected protocol:', protocol);
  console.log('Raw API Key:', apiKey);
  console.log('Clean API Key length:', cleanApiKey.length);
  console.log('Clean API Key starts with:', cleanApiKey.substring(0, 10) + '...');
  console.log('User ID:', userId);
  console.log('Conversation ID:', conversationId);
  console.log('Auth parameter formats to try:', authParams.map(p => p.replace(cleanApiKey, '***')));
  
  // Alternative URLs to try (in order of preference)
  const alternativeUrls = [
    wsUrlWithAuth, // URL with auth parameters
    `${protocol}${baseHost}/conversation/${conversationId}/stream`, // Simple URL
  ];
  
  console.log('Alternative URLs to try:', alternativeUrls);
  
  // Use the first URL (with auth params)
  const wsUrl = alternativeUrls[0];
  console.log('Using WebSocket URL:', wsUrl.replace(cleanApiKey, '***API_KEY***'));
  
  // Try simple connection without URL params first
  let ws;
  
  try {
    console.log('Attempting WebSocket connection...');
    ws = new WebSocket(wsUrl);
    console.log('WebSocket object created successfully');
    
    // Add additional debugging for connection state changes
    ws.addEventListener('open', () => {
      console.log('🔥 WebSocket OPEN event fired');
    });
    
    ws.addEventListener('error', (error) => {
      console.error('🔥 WebSocket ERROR event fired:', error);
      console.error('Error details:', {
        type: error.type,
        target: error.target,
        timeStamp: error.timeStamp,
        isTrusted: error.isTrusted
      });
    });
    
    ws.addEventListener('close', (event) => {
      console.error('🔥 WebSocket CLOSE event fired:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        type: event.type,
        timeStamp: event.timeStamp
      });
    });
    
  } catch (error) {
    console.error('Failed to create WebSocket:', error);
    throw error;
  }
  
  // Store auth info for use after connection
  (ws as any).authInfo = {
    apiKey: apiKey.replace(/^Bearer\s+/i, ''),
    userId,
    conversationId
  };
  
  return ws;
}

/**
 * Convert audio blob to base64 for WebSocket transmission
 */
export function audioBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data URL prefix "data:audio/webm;base64,"
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
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
 * Send audio data through WebSocket
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

/**
 * Create conversation via API
 */
export async function createConversation(
  title: string,
  userId: string,
  apiKey: string,
  apiEndpoint: string
): Promise<{ id: string } | null> {
  try {
    // Generate UUID for conversation ID
    const conversationId = generateUUID();
    
    // Remove 'Bearer ' prefix if it exists, then add it back
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '');
    
    const headers = {
      'Authorization': `${cleanApiKey}`,
      'OTO_USER_ID': userId,
      'Content-Type': 'application/json',
    };
    const body = { 
      id: conversationId,
      title 
    };
    
    // Try different possible API paths based on the correct API spec
    const possiblePaths = [
      `/conversation`,  // Main API path according to spec
      `/api/conversation`,
      `/v1/conversation`,
      `/api/v1/conversation`,
      `/conversations`,  // Fallback plural forms
      `/api/conversations`,
      `/v1/conversations`,
      `/api/v1/conversations`
    ];
    
    console.log('=== TRYING DIFFERENT API PATHS ===');
    
    for (const path of possiblePaths) {
      const url = `${apiEndpoint}${path}`;
      console.log(`Trying URL: ${url}`);
      
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });
        
        console.log(`Response for ${path}:`, response.status, response.statusText);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Success with path:', path);
          console.log('Response data:', data);
          return { id: conversationId };
        } else if (response.status !== 404) {
          // If it's not 404, the endpoint exists but there might be other issues
          const errorText = await response.text();
          console.log(`Non-404 error for ${path}:`, errorText);
          try {
            const errorData = JSON.parse(errorText);
            console.error('Error data:', errorData);
          } catch (e) {
            console.error('Could not parse error response as JSON');
          }
        }
      } catch (error) {
        console.error(`Error with path ${path}:`, error);
      }
    }
    
    console.error('❌ All API paths failed');
    return null;
  } catch (error) {
    console.error('❌ Error creating conversation:', error);
    return null;
  }
}

/**
 * Get conversation list via API
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
    const queryParams = new URLSearchParams();
    if (options?.status) queryParams.append('status', options.status);
    if (options?.updatedSince) queryParams.append('updated_since', options.updatedSince);
    if (options?.limit) queryParams.append('limit', options.limit.toString());
    if (options?.offset) queryParams.append('offset', options.offset.toString());
    
    // Use correct API path according to spec: /conversation not /conversations
    const url = `${apiEndpoint}/conversation${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: createAuthHeaders(apiKey, userId),
    });
    
    if (response.ok) {
      const data = await response.json();
      
      // Handle different response structures
      if (Array.isArray(data)) {
        return data;
      } else if (data.conversations && Array.isArray(data.conversations)) {
        return data.conversations;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (data.message && data.message === 'No conversations found') {
        return [];
      } else if (typeof data === 'object' && data !== null) {
        // If it's an object but not the expected structure, try to find any array property
        const arrayProps = Object.keys(data).filter(key => Array.isArray(data[key]));
        if (arrayProps.length > 0) {
          return data[arrayProps[0]];
        }
      }
      
      console.log('Unknown response structure, returning empty array');
      return [];
    }
    
    // Log error details
    const errorText = await response.text();
    console.error('Failed to fetch conversations:', {
      status: response.status,
      statusText: response.statusText,
      errorText: errorText,
      url: url
    });
    
    // Try to parse error response
    try {
      const errorData = JSON.parse(errorText);
      console.error('Parsed error data:', errorData);
    } catch (e) {
      console.error('Could not parse error response as JSON');
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

/**
 * Get conversation detail via API
 */
export async function getConversationDetail(
  conversationId: string,
  userId: string,
  apiKey: string,
  apiEndpoint: string
): Promise<any | null> {
  try {
    // Remove 'Bearer ' prefix if it exists, then add it back
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '');
    
    // Use correct API path: /conversation/{id} not /conversations/{id}
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
 */
export async function deleteConversation(
  conversationId: string,
  userId: string,
  apiKey: string,
  apiEndpoint: string
): Promise<boolean> {
  try {
    // Remove 'Bearer ' prefix if it exists, then add it back
    const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '');
    
    // Use correct API path: /conversation/{id} not /conversations/{id}
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
 * Test WebSocket connection with different URL patterns
 */
export async function testWebSocketConnection(
  conversationId: string,
  userId: string,
  apiKey: string,
  apiEndpoint: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const protocol = apiEndpoint.startsWith('https://') ? 'wss://' : 'ws://';
  const baseHost = apiEndpoint.replace(/^https?:\/\//, '');
  
  // Test different URL patterns
  const urlPatterns = [
    `${protocol}${baseHost}/conversation/${conversationId}/stream`,
  ];
  
  console.log('🧪 Testing WebSocket connection patterns...');
  
  for (const url of urlPatterns) {
    try {
      console.log(`Testing URL: ${url}`);
      
      const result = await new Promise<{ success: boolean; error?: string }>((resolve) => {
        const ws = new WebSocket(url);
        const timeout = setTimeout(() => {
          ws.close();
          resolve({ success: false, error: 'Connection timeout' });
        }, 5000);
        
        ws.onopen = () => {
          console.log(`✅ Connection successful: ${url}`);
          clearTimeout(timeout);
          ws.close();
          resolve({ success: true });
        };
        
        ws.onerror = (error) => {
          console.log(`❌ Connection failed: ${url}`, error);
          clearTimeout(timeout);
          resolve({ success: false, error: 'Connection error' });
        };
        
        ws.onclose = (event) => {
          if (event.code !== 1000) {
            console.log(`❌ Connection closed with code ${event.code}: ${url}`);
            clearTimeout(timeout);
            resolve({ success: false, error: `Close code: ${event.code}` });
          }
        };
      });
      
      if (result.success) {
        return { success: true, url };
      }
      
    } catch (error) {
      console.log(`❌ Exception for ${url}:`, error);
    }
  }
  
  return { success: false, error: 'All connection patterns failed' };
}
