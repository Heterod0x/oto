import axios, { AxiosInstance } from 'axios';
import { Action, Conversation, ConversationLog, ApiConfig } from '../types';

export class ApiService {
  private api: AxiosInstance;
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
    this.api = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': config.authToken,
        'OTO_USER_ID': config.userId,
      },
    });
  }

  // Health check
  async getHealth() {
    const response = await this.api.get('/health');
    return response.data;
  }

  // API info
  async getApiInfo() {
    const response = await this.api.get('/');
    return response.data;
  }

  // Actions
  async listActions(params?: {
    conversation_id?: string;
    status?: string;
    type?: string;
  }) {
    const response = await this.api.get('/actions', { params });
    return response.data.actions as Action[];
  }

  async getAction(actionId: string) {
    const response = await this.api.get(`/action/${actionId}`);
    return response.data as Action;
  }

  async updateAction(actionId: string, status: string) {
    const response = await this.api.patch(`/action/${actionId}`, { status });
    return response.data;
  }

  // Conversations
  async listConversations(params?: {
    status?: 'active' | 'archived';
    updated_since?: string;
    limit?: number;
    offset?: number;
  }) {
    const response = await this.api.get('/conversations', { params });
    return response.data.conversations as Conversation[];
  }

  async getConversationAudioUrl(conversationId: string) {
    const response = await this.api.get(`/conversation/${conversationId}/audio_url`);
    return response.data;
  }

  async getConversationTranscript(conversationId: string, format: 'plain' | 'srt' | 'vtt' = 'plain') {
    const response = await this.api.get(`/conversation/${conversationId}/transcript`, {
      params: { format }
    });
    return response.data;
  }

  async getConversationLogs(conversationId: string, params?: {
    limit?: number;
    offset?: number;
  }) {
    const response = await this.api.get(`/conversation/${conversationId}/logs`, { params });
    return response.data.logs as ConversationLog[];
  }

  // Update configuration
  updateConfig(config: Partial<ApiConfig>) {
    this.config = { ...this.config, ...config };
    this.api.defaults.baseURL = this.config.baseUrl;
    this.api.defaults.headers['Authorization'] = this.config.authToken;
    this.api.defaults.headers['OTO_USER_ID'] = this.config.userId;
  }
}
