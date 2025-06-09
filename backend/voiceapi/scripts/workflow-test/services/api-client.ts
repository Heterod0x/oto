import fetch from 'node-fetch';
import { TestConfig, Action } from '../types';
import { Logger } from '../utils/logger';

export class ApiClient {
  constructor(private config: TestConfig) {}

  private async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    const url = `${this.config.serverUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.apiKey}`,
      'oto-user-id': this.config.userId,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    return response.json();
  }

  async listActions(conversationId: string): Promise<Action[]> {
    Logger.log(`📋 Fetching actions for conversation: ${conversationId}`);
    
    const response = await this.makeRequest(`/actions?conversation_id=${conversationId}`) as { actions: Action[] };
    Logger.log('📋 Retrieved actions:', response.actions);
    
    return response.actions;
  }

  async updateActionStatus(actionId: string, status: Action['status']): Promise<any> {
    Logger.log(`🔄 Updating action ${actionId} status to: ${status}`);
    
    const response = await this.makeRequest(`/action/${actionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    
    Logger.success('Action updated:', response);
    return response;
  }

  async getConversationTranscript(conversationId: string): Promise<any> {
    Logger.log(`📄 Fetching final transcript for conversation: ${conversationId}`);
    
    try {
      const response = await this.makeRequest(`/conversation/${conversationId}/transcript`);
      Logger.log('📄 Final transcript:', response);
      return response;
    } catch (error) {
      Logger.warning('Transcript not yet available:', (error as Error).message);
      throw error;
    }
  }

  async getConversationAudioUrl(conversationId: string): Promise<any> {
    Logger.log(`🎵 Fetching audio URL for conversation: ${conversationId}`);
    
    try {
      const response = await this.makeRequest(`/conversation/${conversationId}/audio_url`);
      Logger.log('🎵 Audio URL:', response);
      return response;
    } catch (error) {
      Logger.warning('Audio URL not yet available:', (error as Error).message);
      throw error;
    }
  }

  async getConversationLogs(conversationId: string): Promise<any> {
    Logger.log(`📊 Fetching conversation logs: ${conversationId}`);
    
    try {
      const response = await this.makeRequest(`/conversation/${conversationId}/logs`);
      Logger.log('📊 Conversation logs:', response);
      return response;
    } catch (error) {
      Logger.warning('Conversation logs not yet available:', (error as Error).message);
      throw error;
    }
  }
}
