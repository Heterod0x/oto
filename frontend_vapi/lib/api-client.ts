/**
 * API Client for VAPI integration
 * API client for voice calls with agents and task processing
 */

export interface Task {
  id: string;
  type: 'TODO' | 'CAL' | 'TASK';
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
  createdAt: string;
}

export interface ConversationSession {
  id: string;
  userId: string;
  status: 'active' | 'ended';
  startedAt: string;
  endedAt?: string;
  tasks: Task[];
}

/**
 * API client with streaming support
 */
export class VAPIClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001') {
    this.baseURL = baseURL;
  }

  /**
   * Set access token
   */
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Get request headers
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  /**
   * Start voice streaming session
   */
  async startVoiceSession(): Promise<{ sessionId: string; wsUrl: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/voice/session/start`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to start voice session: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting voice session:', error);
      throw error;
    }
  }

  /**
   * End voice streaming session
   */
  async endVoiceSession(sessionId: string): Promise<ConversationSession> {
    try {
      const response = await fetch(`${this.baseURL}/api/voice/session/${sessionId}/end`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to end voice session: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error ending voice session:', error);
      throw error;
    }
  }

  /**
   * Get task list via streaming
   */
  async streamTasks(sessionId: string, onTask: (task: Task) => void, onComplete: () => void): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/api/tasks/stream/${sessionId}`, {
        method: 'GET',
        headers: {
          ...this.getHeaders(),
          'Accept': 'text/event-stream',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to stream tasks: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = line.slice(6);
              if (data === '[DONE]') {
                onComplete();
                return;
              }
              
              const task: Task = JSON.parse(data);
              onTask(task);
            } catch (error) {
              console.error('Error parsing task data:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming tasks:', error);
      throw error;
    }
  }

  /**
   * Add task to Google Calendar
   */
  async addToGoogleCalendar(task: Task): Promise<{ success: boolean; eventId?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/calendar/google/add`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ task }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add to Google Calendar: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding to Google Calendar:', error);
      throw error;
    }
  }

  /**
   * Add task to iOS calendar (using Web API)
   */
  async addToIosCalendar(task: Task): Promise<{ success: boolean; eventId?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/calendar/ios/add`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ task }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add to iOS Calendar: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding to iOS Calendar:', error);
      throw error;
    }
  }

  /**
   * Establish WebSocket connection (for voice streaming)
   */
  createWebSocketConnection(wsUrl: string): WebSocket {
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected for voice streaming');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return ws;
  }
}

// Singleton instance
export const apiClient = new VAPIClient();
