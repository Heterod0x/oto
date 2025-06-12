import { Agent, run, MCPServerStdio } from '@openai/agents';
import { Response } from 'express';
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

export class ConversationAgentService {
  private mcpServer: MCPServerStdio | null = null;
  private agent: Agent | null = null;

  constructor() {
    this.initializeAgent();
  }

  private async initializeAgent() {
    try {
      // Initialize MCP server pointing to our built MCP server
      this.mcpServer = new MCPServerStdio({
        name: 'Conversation Context Server',
        fullCommand: `node ${path.join(process.cwd(), 'dist/mcp/index.js')}`,
      });

      // Connect to the MCP server
      await this.mcpServer.connect();

      // Create the agent with MCP server
      this.agent = new Agent({
        name: 'Conversation Assistant',
        instructions: `You are a helpful assistant that can answer questions about the user's historical conversations.

When a user asks about their past conversations, meetings, todos, or any historical context:
1. Use the available MCP tools to search for relevant conversations
2. Get detailed context from the most relevant conversations
3. Provide specific, accurate answers based on the conversation data
4. Reference which conversations or time periods you're drawing from
5. If no relevant conversations are found, let the user know

Always be helpful and provide context-aware responses when conversation data is available.

Start the conversation with "Hello, how can I help you today?"
`,
        mcpServers: [this.mcpServer],
        model: 'gpt-4o-mini',
      });

      console.log('Conversation Agent initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Conversation Agent:', error);
      // Create a fallback agent without MCP if initialization fails
      this.agent = new Agent({
        name: 'Basic Assistant',
        instructions: 'You are a helpful assistant.',
        model: 'gpt-4o-mini',
      });
    }
  }

  async handleChatCompletion(request: ChatCompletionRequest) {
    if (!this.agent) {
      throw new Error('Agent not initialized');
    }

    const { messages, model = 'gpt-4o-mini', temperature = 0.7, max_tokens = 1000, user_id } = request;
    
    // Get the user's query (last message)
    const userQuery = messages[messages.length - 1]?.content || '';
    
    // Build the input for the agent
    let agentInput = userQuery;
    
    // If user_id is provided, add it as context for the MCP tools
    if (user_id) {
      agentInput = `[User ID: ${user_id}] ${userQuery}`;
    }

    try {
      // Run the agent with the user's query
      const result = await run(this.agent, agentInput);

      return {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: result.finalOutput,
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 0, // The Agents SDK doesn't expose token counts
          completion_tokens: 0,
          total_tokens: 0,
        },
      };
    } catch (error) {
      console.error('Error running agent:', error);
      throw new Error(`Agent execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async handleStreamingChatCompletion(request: ChatCompletionRequest, res: Response) {
    if (!this.agent) {
      throw new Error('Agent not initialized');
    }

    const { messages, model = 'gpt-4o-mini', user_id } = request;
    
    // Get the user's query (last message)
    const userQuery = messages[messages.length - 1]?.content || '';
    
    // Build the input for the agent
    let agentInput = userQuery;
    
    // If user_id is provided, add it as context for the MCP tools
    if (user_id) {
      agentInput = `[User ID: ${user_id}] ${userQuery}`;
    }

    try {
      // Run the agent with streaming
      const result = await run(this.agent, agentInput, { stream: true });

      let chunkIndex = 0;
      
      for await (const event of result) {
        // Handle different types of streaming events
        if (event.type === 'raw_model_stream_event' && 
            event.data.type === 'model' && 
            event.data.event.type === 'response.output_text.delta') {
          
          const deltaContent = event.data.event.delta;
          
          if (deltaContent) {
            const chunk = {
              id: `chatcmpl-${Date.now()}`,
              object: 'chat.completion.chunk',
              created: Math.floor(Date.now() / 1000),
              model,
              choices: [
                {
                  index: 0,
                  delta: {
                    content: deltaContent,
                  },
                  finish_reason: null,
                },
              ],
            };
            
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            chunkIndex++;
          }
        }
      }

      // Send final chunk
      const finalChunk = {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion.chunk',
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [
          {
            index: 0,
            delta: {},
            finish_reason: 'stop',
          },
        ],
      };
      
      res.write(`data: ${JSON.stringify(finalChunk)}\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (error) {
      console.error('Error in streaming agent execution:', error);
      
      // Send error as streaming chunk
      const errorChunk = {
        id: `chatcmpl-${Date.now()}`,
        object: 'chat.completion.chunk',
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [
          {
            index: 0,
            delta: {
              content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
            finish_reason: 'stop',
          },
        ],
      };
      
      res.write(`data: ${JSON.stringify(errorChunk)}\n\n`);
      res.write(`data: [DONE]\n\n`);
      res.end();
    }
  }

  async cleanup() {
    if (this.mcpServer) {
      try {
        await this.mcpServer.close();
        console.log('MCP server connection closed');
      } catch (error) {
        console.error('Error closing MCP server:', error);
      }
    }
  }

  // Method to reinitialize the agent if needed
  async reinitialize() {
    await this.cleanup();
    await this.initializeAgent();
  }
}
