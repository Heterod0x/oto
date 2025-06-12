import { OpenAI } from 'openai';
import { Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  model?: string;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
  user_id?: string; // Custom field for user identification
}

interface ConversationSearchResult {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  relevance_score: number;
  preview: string;
}

interface ConversationContext {
  conversation: any;
  logs: any[];
  full_transcript: string;
}

export class ConversationLLMService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async handleChatCompletion(request: ChatCompletionRequest) {
    const { messages, model = 'gpt-4o-mini', temperature = 0.7, max_tokens = 1000, user_id } = request;
    
    // Get the user's query (last message)
    const userQuery = messages[messages.length - 1]?.content || '';
    
    // Enhanced messages with conversation context
    const enhancedMessages = await this.enhanceMessagesWithContext(messages, user_id, userQuery);

    // Call OpenAI with enhanced context
    const completion = await this.openai.chat.completions.create({
      model,
      messages: enhancedMessages,
      temperature,
      max_tokens,
    });

    return {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model,
      choices: completion.choices,
      usage: completion.usage,
    };
  }

  async handleStreamingChatCompletion(request: ChatCompletionRequest, res: Response) {
    const { messages, model = 'gpt-4o-mini', temperature = 0.7, max_tokens = 1000, user_id } = request;
    
    // Get the user's query (last message)
    const userQuery = messages[messages.length - 1]?.content || '';
    
    // Enhanced messages with conversation context
    const enhancedMessages = await this.enhanceMessagesWithContext(messages, user_id, userQuery);

    // Create streaming completion
    const stream = await this.openai.chat.completions.create({
      model,
      messages: enhancedMessages,
      temperature,
      max_tokens,
      stream: true,
    });

    // Stream the response
    for await (const chunk of stream) {
      const data = {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion.chunk',
        created: Math.floor(Date.now() / 1000),
        model,
        choices: chunk.choices,
      };
      
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    // Send final chunk
    res.write(`data: [DONE]\n\n`);
    res.end();
  }

  private async enhanceMessagesWithContext(
    messages: ChatMessage[], 
    userId?: string, 
    userQuery?: string
  ): Promise<ChatMessage[]> {
    if (!userId || !userQuery) {
      return messages;
    }

    try {
      // Search for relevant conversations using MCP server
      const relevantConversations = await this.searchConversations(userId, userQuery);
      
      if (relevantConversations.length === 0) {
        return messages;
      }

      // Get detailed context for the most relevant conversations
      const conversationIds = relevantConversations.slice(0, 3).map(conv => conv.id); // Top 3 most relevant
      const conversationContexts = await this.getConversationContext(userId, conversationIds);

      // Build context string
      const contextString = this.buildContextString(conversationContexts, relevantConversations);

      // Create enhanced system message
      const systemMessage: ChatMessage = {
        role: 'system',
        content: `You are a helpful assistant that can answer questions about the user's historical conversations. 

Here is the relevant conversation context based on the user's query:

${contextString}

Instructions:
1. Use the provided conversation context to answer the user's question
2. If the context contains relevant information, reference it in your response
3. If the context doesn't contain relevant information, let the user know
4. Be specific about which conversation or time period you're referencing
5. Provide helpful summaries and extract key information as needed

Please answer the user's question based on this context.`,
      };

      // Insert system message at the beginning, or replace existing system message
      const enhancedMessages = [...messages];
      if (enhancedMessages[0]?.role === 'system') {
        enhancedMessages[0] = systemMessage;
      } else {
        enhancedMessages.unshift(systemMessage);
      }

      return enhancedMessages;
    } catch (error) {
      console.error('Error enhancing messages with context:', error);
      return messages; // Return original messages if context enhancement fails
    }
  }

  private async searchConversations(userId: string, query: string): Promise<ConversationSearchResult[]> {
    return new Promise((resolve, reject) => {
      const mcpServerPath = path.join(process.cwd(), 'dist/mcp/index.js');
      const mcpProcess = spawn('node', [mcpServerPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let output = '';
      let errorOutput = '';

      mcpProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      mcpProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      mcpProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`MCP process exited with code ${code}: ${errorOutput}`));
          return;
        }

        try {
          // Parse the MCP response
          const lines = output.split('\n').filter(line => line.trim());
          const lastLine = lines[lines.length - 1];
          const response = JSON.parse(lastLine);
          
          if (response.content && response.content[0] && response.content[0].text) {
            const searchResult = JSON.parse(response.content[0].text);
            resolve(searchResult.results || []);
          } else {
            resolve([]);
          }
        } catch (error) {
          reject(new Error(`Failed to parse MCP response: ${error}`));
        }
      });

      // Send search request to MCP server
      const searchRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'search_conversations',
          arguments: {
            user_id: userId,
            query: query,
            limit: 5,
          },
        },
      };

      mcpProcess.stdin.write(JSON.stringify(searchRequest) + '\n');
      mcpProcess.stdin.end();
    });
  }

  private async getConversationContext(userId: string, conversationIds: string[]): Promise<ConversationContext[]> {
    return new Promise((resolve, reject) => {
      const mcpServerPath = path.join(process.cwd(), 'dist/mcp/index.js');
      const mcpProcess = spawn('node', [mcpServerPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let output = '';
      let errorOutput = '';

      mcpProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      mcpProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      mcpProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`MCP process exited with code ${code}: ${errorOutput}`));
          return;
        }

        try {
          // Parse the MCP response
          const lines = output.split('\n').filter(line => line.trim());
          const lastLine = lines[lines.length - 1];
          const response = JSON.parse(lastLine);
          
          if (response.content && response.content[0] && response.content[0].text) {
            const contextResult = JSON.parse(response.content[0].text);
            resolve(contextResult.contexts || []);
          } else {
            resolve([]);
          }
        } catch (error) {
          reject(new Error(`Failed to parse MCP response: ${error}`));
        }
      });

      // Send context request to MCP server
      const contextRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: 'get_conversation_context',
          arguments: {
            user_id: userId,
            conversation_ids: conversationIds,
          },
        },
      };

      mcpProcess.stdin.write(JSON.stringify(contextRequest) + '\n');
      mcpProcess.stdin.end();
    });
  }

  private buildContextString(contexts: ConversationContext[], searchResults: ConversationSearchResult[]): string {
    let contextString = '';

    contexts.forEach((context, index) => {
      const searchResult = searchResults.find(sr => sr.id === context.conversation.id);
      const relevanceScore = searchResult?.relevance_score || 0;
      
      contextString += `\n--- Conversation ${index + 1} (Relevance: ${relevanceScore}) ---\n`;
      contextString += `Title: ${context.conversation.title || 'Untitled'}\n`;
      contextString += `Date: ${new Date(context.conversation.created_at).toLocaleDateString()}\n`;
      
      if (searchResult?.preview) {
        contextString += `Preview: ${searchResult.preview}\n`;
      }
      
      if (context.full_transcript) {
        // Limit transcript length to avoid token limits
        const maxTranscriptLength = 2000;
        const transcript = context.full_transcript.length > maxTranscriptLength 
          ? context.full_transcript.substring(0, maxTranscriptLength) + '...'
          : context.full_transcript;
        contextString += `Transcript: ${transcript}\n`;
      }

      // Add conversation logs summaries
      if (context.logs && context.logs.length > 0) {
        contextString += `Summaries:\n`;
        context.logs.forEach((log, logIndex) => {
          contextString += `  ${logIndex + 1}. [${log.speaker}]: ${log.summary}\n`;
        });
      }
      
      contextString += '\n';
    });

    return contextString;
  }
}
