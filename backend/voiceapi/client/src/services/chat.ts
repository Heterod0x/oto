import axios, { AxiosInstance } from 'axios';
import { ChatMessage, ChatCompletionRequest, ChatCompletionResponse, ApiConfig } from '../types';

export class ChatService {
  private api: AxiosInstance;
  private config: ApiConfig;
  private llmApiBaseUrl: string;

  constructor(config: ApiConfig) {
    this.config = config;
    // LLM API typically runs on port 3002, derive from main API URL
    const baseUrl = new URL(config.baseUrl);
    baseUrl.port = '3002';
    this.llmApiBaseUrl = baseUrl.toString().replace(/\/$/, '');
    
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
    const baseUrl = new URL(this.config.baseUrl);
    baseUrl.port = '3002';
    this.llmApiBaseUrl = baseUrl.toString().replace(/\/$/, '');
    this.api.defaults.baseURL = this.llmApiBaseUrl;
  }
}
