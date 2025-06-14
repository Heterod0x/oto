/**
 * API Client for VAPI integration
 * API client for voice calls with agents and task processing
 */

export interface Task {
  id: string;
  type: "TODO" | "CAL" | "TASK";
  title: string;
  description?: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  completed?: boolean;
  createdAt: string;
}

export interface ConversationSession {
  id: string;
  userId: string;
  status: "active" | "ended";
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

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001") {
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
      "Content-Type": "application/json",
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  /**
   * Start voice streaming session
   */
  async startVoiceSession(): Promise<{ sessionId: string; wsUrl: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/voice/session/start`, {
        method: "POST",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to start voice session: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error starting voice session:", error);
      throw error;
    }
  }

  /**
   * End voice streaming session
   */
  async endVoiceSession(sessionId: string): Promise<ConversationSession> {
    try {
      const response = await fetch(`${this.baseURL}/api/voice/session/${sessionId}/end`, {
        method: "POST",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to end voice session: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error ending voice session:", error);
      throw error;
    }
  }

  /**
   * Get task list via streaming
   */
  async streamTasks(
    sessionId: string,
    onTask: (task: Task) => void,
    onComplete: () => void,
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/api/tasks/stream/${sessionId}`, {
        method: "GET",
        headers: {
          ...this.getHeaders(),
          Accept: "text/event-stream",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to stream tasks: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          onComplete();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = line.slice(6);
              if (data === "[DONE]") {
                onComplete();
                return;
              }

              const task: Task = JSON.parse(data);
              onTask(task);
            } catch (error) {
              console.error("Error parsing task data:", error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error streaming tasks:", error);
      throw error;
    }
  }

  /**
   * Add task to Google Calendar (using Google Calendar URL)
   */
  async addToGoogleCalendar(task: Task): Promise<{ success: boolean; eventId?: string }> {
    try {
      // Import calendar utilities (dynamic import for client-side only)
      const { openGoogleCalendar } = await import("./calendar-utils");

      console.log("📅 Adding task to Google Calendar:", task.title);

      // Open Google Calendar with pre-filled event
      const result = await openGoogleCalendar({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        type: task.type,
      });

      if (result.success) {
        return {
          success: true,
          eventId: task.id, // Return task ID as event identifier
        };
      } else {
        // Even if popup was blocked, we can still consider it a success
        // since the URL is available for manual opening
        if (result.url) {
          console.log("📋 Google Calendar URL (popup blocked):", result.url);
          return {
            success: true,
            eventId: task.id,
          };
        }
        throw new Error("Failed to create Google Calendar event");
      }
    } catch (error) {
      console.error("Error adding to Google Calendar:", error);
      throw error;
    }
  }

  /**
   * Add task to iOS calendar (using .ics file download)
   * Based on: https://qiita.com/bananbo/items/281f2c98419355d7324c
   */
  async addToIosCalendar(task: Task): Promise<{ success: boolean; eventId?: string }> {
    try {
      // Import calendar utilities (dynamic import for client-side only)
      const { createAndDownloadIcsFile, isIcsDownloadSupported } = await import("./calendar-utils");

      // Check if .ics download is supported
      if (!isIcsDownloadSupported()) {
        throw new Error("Calendar file download is not supported in this environment");
      }

      console.log("📱 Adding task to iOS Calendar via .ics download:", task.title);

      // Create and download .ics file
      const result = await createAndDownloadIcsFile({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        type: task.type,
      });

      if (result.success) {
        return {
          success: true,
          eventId: result.filename, // Return filename as event identifier
        };
      } else {
        throw new Error("Failed to create calendar file");
      }
    } catch (error) {
      console.error("Error adding to iOS Calendar:", error);
      throw error;
    }
  }

  /**
   * Establish WebSocket connection (for voice streaming)
   */
  createWebSocketConnection(wsUrl: string): WebSocket {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected for voice streaming");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return ws;
  }
}

// Singleton instance
export const apiClient = new VAPIClient();
