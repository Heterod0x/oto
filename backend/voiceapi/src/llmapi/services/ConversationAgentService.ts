import { BeautifiedSegment } from '@/services/transcriptionBeautifier';
import { Agent, run, MCPServerStdio, AgentInputItem, user, assistant, system } from '@openai/agents';
import { Response } from 'express';
import path from 'path';

import { tool } from '@openai/agents';
import { z } from 'zod';

// key: call-id, value: conversation_id
// TODO: this is not scalable, we need to use a database to store the conversation ids
const conversationCache = new Map<string, string>();

export const getTodayTool = tool({
  name: 'get_now',
  description: "Returns current date and time in ISO 8601 format",
  parameters: z.object({}),  // no inputs required
  async execute() {
    const today = new Date().toISOString();
    return today;  // e.g. "2025-06-12T12:00:00.000Z"
  },
});

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
  metadata?: {OTO_USER_ID: string};
  call?: {id: string};
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
        cacheToolsList: true,
      });

      // Connect to the MCP server
      await this.mcpServer.connect();

      // Create the agent with MCP server
      this.agent = new Agent({
        name: 'Conversation Assistant',
        instructions: `You are a helpful assistant that can answer questions about the user's historical conversations.

When a user asks about their past conversations, meetings, todos, or any historical context:
1. Use the available MCP tools to search for relevant conversations
2. Get detailed context from the most relevant conversations. 
3. Provide specific, accurate answers based on the conversation data
4. Reference which conversations or time periods you're drawing from
5. If no relevant conversations are found, let the user know

Present some kind of the information even if you are not sure about which one is the most relevant.
You need to read between the lines and understand the user's intent. User is on the phone, so they talk like really short. But you need to understand the user's intent.

When you do the search, search a little bit wider range of dates than the user's query to collect properly.
When you use MCP tools, you have to say "I'm looking up the information, wait for a second..." or something like that in the language that the user is using, before starting to use the tool. (dont use same text for every tool call to make user feels humanity)

Always be helpful and provide context-aware responses when conversation data is available. 
You are the conversational agent on a phone call, so you must be concise and to the point when you are talking to the user. We will use text-to-speech to convert your responses to speech, so your text must be in that manner. (Except final systematic conversation id reference)

If you decided to use the conversation, you MUST return the conversation_id at the end of your response in this format always as a systematic reference to the conversation.
"""
<<conversation_id: x>>
"""

Also as a user input, we may provide a [Current Reference Conversation Transcript: ...] and [Current Reference Conversation ID: ...] in order to provide context to the user's query.
Don't talk about the reference conversation in your response, its systematic, just use it as a reference to provide context to the user's query.
You DON'T have to use MCP tools if user provide the reference and user didn't change the target conversation to reference. Just use the reference in that case.

When you respond to the user, you should use the same language as the user's query.
This is a phone call, you need to be really careful about the context between previous user input and the latest one. Talk to the user like you are talking on the phone.
`,
        mcpServers: [this.mcpServer],
        tools: [getTodayTool],
        model: 'gpt-4.1',
        modelSettings: {
            temperature: 0.9,
        }
      });

      this.agent.on("agent_tool_end", (c, t) => {
        console.log("Agent tool end", c, t);
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
    throw new Error('Not implemented');
  }

  async handleStreamingChatCompletion(request: ChatCompletionRequest, res: Response) {
    console.log('handleStreamingChatCompletion');
    console.log(request);

    if (!this.agent) {
      throw new Error('Agent not initialized');
    }

    let { messages, model = 'gpt-4o', user_id, metadata, call } = request;
    
    // remove system messages from the messages array
    messages = messages.filter(message => message.role !== 'system');
    
    // Get the user's query (last message)
    const userQuery = messages[messages.length - 1]?.content || '';
    messages = messages.slice(0, -1);

    let conversations: {
        plainTranscript: string;
        conversationId: string;
    }[] = [];

    if (messages.length >= 2) {
        let conversationIds: string[] = [];

        let conversationIdsContext = "";

        if (conversationCache.has(call?.id || "")) {
            conversationIdsContext = conversationCache.get(call?.id || "") || "";
        } else {
            conversationIdsContext = messages[messages.length-1]?.content;
        }

        if (conversationIdsContext.includes("<<conversation_id: ") && conversationIdsContext.includes(">>")) {
            conversationIds = conversationIdsContext.split("<<conversation_id: ")[1].split(">>")[0].split(",");
            conversationIds = conversationIds.map(id => id.trim());
            conversationIds = conversationIds.filter(id => id.length >= 16);
            console.log("Conversation IDs: ", conversationIds);
        }

        if (conversationIds.length > 0) {
            const conversationContext = await this.mcpServer!.callTool("get_conversation_context", {
                user_id,
                conversation_ids: conversationIds,
            });
            const parsed = JSON.parse(conversationContext[0]["text"]);

            for (let i = 0; i < conversationIds.length; i++) {
                const conversationId = conversationIds[i];
                const conversation = parsed.contexts[i].conversation;
                const date = conversation.created_at;
                const transcript = JSON.parse(conversation.transcript) as BeautifiedSegment[];

                conversations.push({
                    plainTranscript: "Date: " + date + "\n\n" + "Summary: " + conversation.last_transcript_preview + "\n\n" + "Transcript: " + transcript.map(t => t.beautifiedText).join("\n"),
                    conversationId: conversationId,
                });
            }
        }
    }
    
    // Build the input for the agent
    let agentInput = "";
    
    if (conversations.length > 0) {
        let idx = 1;
        for (const conversation of conversations) {
            agentInput += `\n\n[Current Reference Conversation Transcript ${idx}: """${conversation.plainTranscript}"""]`;
            agentInput += `\n\n[Current Reference Conversation ID ${idx}: "${conversation.conversationId}"]`;
            idx++;
        }
        agentInput += "\n\n";
    }

    // If user_id is provided, add it as context for the MCP tools
    if (metadata?.OTO_USER_ID) {
      agentInput += `\n\n[User ID: "${metadata.OTO_USER_ID}"]`;
    }

    try {
      // Run the agent with streaming
      const agentInputItems: AgentInputItem[] = [];
      for (const message of messages) {
        if (message.role == "user") {
            agentInputItems.push(user(message.content));
        }else {
            agentInputItems.push(assistant(message.content));
        }
      }

      agentInputItems.push(user("[Systematic] Additional context: " + agentInput));
      agentInputItems.push(user(userQuery));

      console.log("Agent Input Items: ", agentInputItems);

      const result = await run(this.agent, agentInputItems, { stream: true });

      let chunkIndex = 0;

      const captureStart = "<<";
      const captureEnd = ">>";
      let capture = false;
      let captureContent = "";

      const handleCaptured = (content: string) => {
        if (call?.id) {
            conversationCache.set(call.id, content);
        }
      }

      // reset conversation cache
      if (call?.id) {
        conversationCache.set(call.id, "");
      }
      
      for await (const event of result) {
        // Handle different types of streaming events
        if (event.type === 'raw_model_stream_event' && 
            event.data.type === 'model' && 
            event.data.event.type === 'response.output_text.delta') {
        
          const deltaContent = event.data.event.delta;

          // capture
          if (deltaContent && deltaContent.includes(captureStart)) {
            capture = true;
            captureContent += deltaContent;
            continue;
          }else if (deltaContent && capture && deltaContent.includes(captureEnd)) {
            capture = false;
            captureContent += deltaContent;
            handleCaptured(captureContent);
            continue;
          } else if (deltaContent && capture) {
            captureContent += deltaContent;
            continue;
          }

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
