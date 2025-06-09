import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config';
import { Action, Conversation, ConversationLog } from '../types';

export class DatabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      config.supabase.url,
      config.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  // Set user context for RLS
  private async setUserContext(userId: string): Promise<void> {
    await this.supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: userId,
      is_local: true,
    });
  }

  // Conversations
  async createConversation(userId: string, title?: string): Promise<Conversation> {
    await this.setUserContext(userId);
    
    const { data, error } = await this.supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create conversation: ${error.message}`);
    }

    return data;
  }

  async getConversation(userId: string, conversationId: string): Promise<Conversation | null> {
    await this.setUserContext(userId);
    
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get conversation: ${error.message}`);
    }

    return data;
  }

  async updateConversation(
    userId: string,
    conversationId: string,
    updates: Partial<Conversation>
  ): Promise<Conversation> {
    await this.setUserContext(userId);
    
    const { data, error } = await this.supabase
      .from('conversations')
      .update(updates)
      .eq('id', conversationId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update conversation: ${error.message}`);
    }

    return data;
  }

  async listConversations(
    userId: string,
    options: {
      status?: 'active' | 'archived';
      updatedSince?: string;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<Conversation[]> {
    await this.setUserContext(userId);
    
    let query = this.supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.updatedSince) {
      query = query.gte('updated_at', options.updatedSince);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, (options.offset + (options.limit || 50)) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list conversations: ${error.message}`);
    }

    return data || [];
  }

  // Actions
  async createAction(userId: string, action: Omit<Action, 'id' | 'created_at' | 'updated_at'>): Promise<Action> {
    await this.setUserContext(userId);
    
    const { data, error } = await this.supabase
      .from('actions')
      .insert({
        ...action,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create action: ${error.message}`);
    }

    return data;
  }

  async getAction(userId: string, actionId: string): Promise<Action | null> {
    await this.setUserContext(userId);
    
    const { data, error } = await this.supabase
      .from('actions')
      .select('*')
      .eq('id', actionId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to get action: ${error.message}`);
    }

    return data;
  }

  async updateAction(
    userId: string,
    actionId: string,
    updates: Partial<Action>
  ): Promise<Action> {
    await this.setUserContext(userId);
    
    const { data, error } = await this.supabase
      .from('actions')
      .update(updates)
      .eq('id', actionId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update action: ${error.message}`);
    }

    return data;
  }

  async listActions(
    userId: string,
    options: {
      conversationId?: string;
      status?: string;
      type?: string;
    } = {}
  ): Promise<Action[]> {
    await this.setUserContext(userId);
    
    let query = this.supabase
      .from('actions')
      .select('*')
      .order('created_at', { ascending: false });

    if (options.conversationId) {
      query = query.eq('conversation_id', options.conversationId);
    }

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.type) {
      query = query.eq('type', options.type);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to list actions: ${error.message}`);
    }

    return data || [];
  }

  // Conversation Logs
  async createConversationLog(
    userId: string,
    log: Omit<ConversationLog, 'id' | 'created_at'>
  ): Promise<ConversationLog> {
    await this.setUserContext(userId);
    
    const { data, error } = await this.supabase
      .from('conversation_logs')
      .insert(log)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create conversation log: ${error.message}`);
    }

    return data;
  }

  async getConversationLogs(
    userId: string,
    conversationId: string,
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<ConversationLog[]> {
    await this.setUserContext(userId);
    
    let query = this.supabase
      .from('conversation_logs')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('start_time', { ascending: true });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, (options.offset + (options.limit || 100)) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to get conversation logs: ${error.message}`);
    }

    return data || [];
  }
}

export const databaseService = new DatabaseService();
