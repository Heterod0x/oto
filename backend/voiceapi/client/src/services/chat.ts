import axios, { AxiosInstance } from 'axios';
import { ChatMessage, ChatCompletionRequest, ChatCompletionResponse, ApiConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ChatService {
  private api: AxiosInstance;
  private config: ApiConfig;
  private llmApiBaseUrl: string;
  private callId: string;
  private userId: string;

  constructor(config: ApiConfig) {
    this.config = config;
    this.llmApiBaseUrl = config.llmApiBaseUrl;
    this.callId = uuidv4();
    this.userId = "test-user-123";
    
    this.api = axios.create({
      baseURL: this.llmApiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async sendMessage(messages: ChatMessage[]): Promise<ChatCompletionResponse> {
    const request: ChatCompletionRequest = {
      messages,
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 1000,
      user_id: this.config.userId,
      metadata: {
        OTO_USER_ID: this.userId,
      },
      call: {
        id: this.callId,
      },
    };

    const response = await this.api.post('/chat/completions', request);
    return response.data;
  }

  async sendMessageStream(
    messages: ChatMessage[],
    onChunk: (content: string) => void,
    onComplete: () => void,
    onError: (error: string) => void
  ): Promise<void> {
    const request: ChatCompletionRequest = {
      messages,
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 1000,
      user_id: this.config.userId,
      stream: true,
      metadata: {
        OTO_USER_ID: this.userId,
      },
      call: {
        id: this.callId,
      },
    };

    try {
      const response = await fetch(`${this.llmApiBaseUrl}/chat/completions/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.choices?.[0]?.delta?.content) {
                onChunk(parsed.choices[0].delta.content);
              }
            } catch (e) {
              // Ignore parsing errors for individual chunks
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }

  async checkHealth(): Promise<{ status: string; service: string }> {
    const response = await this.api.get('/health');
    return response.data;
  }

  updateConfig(config: Partial<ApiConfig>) {
    this.config = { ...this.config, ...config };
    this.llmApiBaseUrl = this.config.llmApiBaseUrl;
    this.api.defaults.baseURL = this.llmApiBaseUrl;
  }
}
