import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ConversationMCPService } from './services/ConversationMCPService';
import dotenv from 'dotenv';
import fs from 'fs';

// load from /etc/secrets/.env if exists
if (fs.existsSync('/etc/secrets/.env')) {
  dotenv.config({ path: '/etc/secrets/.env' });
} else {
  dotenv.config();
}

class ConversationMCPServer {
  private server: Server;
  private conversationService: ConversationMCPService;

  constructor() {
    this.server = new Server(
      {
        name: 'conversation-context-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          logging: {},
        },
      }
    );

    this.conversationService = new ConversationMCPService();
    this.setupToolHandlers();
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_conversations',
            description: 'Search for conversations based on query and date filters',
            inputSchema: {
              type: 'object',
              properties: {
                user_id: {
                  type: 'string',
                  description: 'User ID to search conversations for',
                },
                /*
                query: {
                  type: 'string',
                  description: 'Search query to find relevant conversations',
                },
                date_from: {
                  type: 'string',
                  description: 'Start date for search (ISO string, optional)',
                },
                date_to: {
                  type: 'string',
                  description: 'End date for search (ISO string, optional)',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of conversations to return (default: 10)',
                },*/
              },
              required: ['user_id'],
            },
          },
          {
            name: 'get_conversation_context',
            description: 'Get detailed context for specific conversations including transcripts and summaries',
            inputSchema: {
              type: 'object',
              properties: {
                user_id: {
                  type: 'string',
                  description: 'User ID',
                },
                conversation_ids: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  description: 'Array of conversation IDs to get context for',
                },
              },
              required: ['user_id', 'conversation_ids'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        if (!args) {
          throw new Error('Missing arguments');
        }

        switch (name) {
          case 'search_conversations':
            return await this.conversationService.searchConversations(args as any);

          case 'get_conversation_context':
            return await this.conversationService.getConversationContext(args as any);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Run the server
const server = new ConversationMCPServer();
server.run().catch(console.error);
