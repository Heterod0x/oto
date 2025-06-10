/**
 * WebSocket Audio Streaming Utilities for Oto API
 */

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
 */
export function createAudioWebSocket(
  conversationId: string,
  userId: string,
  apiKey: string,
  apiEndpoint: string
): WebSocket {
  const wsUrl = apiEndpoint.replace(/^https?/, 'ws') + `/conversation/${conversationId}/stream`;
  
  const ws = new WebSocket(wsUrl);
  
  // Set headers after connection (some browsers don't support headers in WebSocket constructor)
  ws.onopen = () => {
    console.log('WebSocket connected for conversation:', conversationId);
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
 * Send audio data through WebSocket
 */
export function sendAudioData(ws: WebSocket, audioData: string): void {
  if (ws.readyState === WebSocket.OPEN) {
    const message: AudioStreamMessage = {
      type: 'audio',
      data: audioData
    };
    ws.send(JSON.stringify(message));
  }
}

/**
 * Send completion signal through WebSocket
 */
export function sendCompleteSignal(ws: WebSocket): void {
  if (ws.readyState === WebSocket.OPEN) {
    const message: AudioStreamMessage = {
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
    const response = await fetch(`${apiEndpoint}/conversation`, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'OTO_USER_ID': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    
    if (response.ok) {
      return await response.json();
    }
    
    console.error('Failed to create conversation:', response.status, response.statusText);
    return null;
  } catch (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
}

/**
 * Get conversation list via API
 */
export async function getConversations(
  userId: string,
  apiKey: string,
  apiEndpoint: string
): Promise<any[]> {
  try {
    const response = await fetch(`${apiEndpoint}/conversation`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey,
        'OTO_USER_ID': userId,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.conversations || [];
    }
    
    console.error('Failed to fetch conversations:', response.status, response.statusText);
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
    const response = await fetch(`${apiEndpoint}/conversation/${conversationId}`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey,
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
    const response = await fetch(`${apiEndpoint}/conversation/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': apiKey,
        'OTO_USER_ID': userId,
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return false;
  }
}
