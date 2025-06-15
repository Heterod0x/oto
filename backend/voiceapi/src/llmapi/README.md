# Conversation LLM API

This is a custom LLM API server that provides conversational AI capabilities with access to historical conversation data. It acts as an agentic system that can search through past conversations and use them as context to answer user questions.

## Features

- **Conversation Search**: Automatically searches through historical conversations based on user queries
- **Context Enhancement**: Enriches LLM responses with relevant conversation transcripts and summaries
- **OpenAI Compatible**: Provides OpenAI-compatible chat completion endpoints
- **Streaming Support**: Supports both regular and streaming chat completions
- **MCP Integration**: Uses Model Context Protocol (MCP) server for conversation data retrieval

## Architecture

The system consists of two main components:

1. **MCP Server** (`src/mcp/`): Provides tools to search and retrieve conversation data from Supabase
2. **LLM API Server** (`src/llmapi/`): Handles chat completion requests and enhances them with conversation context

## API Endpoints

### POST /chat/completions

Standard chat completion endpoint (non-streaming).

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "What did we discuss about the project timeline?"
    }
  ],
  "model": "gpt-4o-mini",
  "temperature": 0.7,
  "max_tokens": 1000,
  "user_id": "user123"
}
```

**Response:**
```json
{
  "id": "chatcmpl-1234567890",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "gpt-4o-mini",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Based on your conversation from yesterday, you discussed..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 100,
    "total_tokens": 250
  }
}
```

### POST /chat/completions/stream

Streaming chat completion endpoint.

**Request Body:** Same as above

**Response:** Server-Sent Events stream with chat completion chunks.

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "conversation-llm-api"
}
```

## How It Works

1. **User Query**: User sends a chat completion request with their question
2. **Context Search**: The system searches through historical conversations using the MCP server
3. **Relevance Ranking**: Conversations are ranked by relevance to the user's query
4. **Context Enhancement**: The most relevant conversations are added to the system prompt
5. **LLM Response**: OpenAI generates a response using the enhanced context
6. **Streaming**: Response is streamed back to the user

## Environment Variables

Make sure to set these environment variables:

```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key

# LLM API Server Port (optional, defaults to 3001)
LLM_API_PORT=3001

# Supabase Configuration (inherited from main app)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Running the Server

### Development Mode

```bash
# Run the LLM API server
npm run dev:llm

# Run the MCP server (for testing)
npm run dev:mcp
```

### Production Mode

```bash
# Build the project
npm run build

# Start the LLM API server
node dist/llmapi/index.js
```

## Usage Examples

### Basic Question About Past Conversations

```bash
curl -X POST http://localhost:3001/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What todos did we create in yesterday'\''s meeting?"
      }
    ],
    "user_id": "user123"
  }'
```

### Streaming Response

```bash
curl -X POST http://localhost:3001/chat/completions/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Summarize the key points from our project discussion"
      }
    ],
    "user_id": "user123",
    "stream": true
  }'
```

## Integration with VAPI

This LLM API can be used as a custom LLM provider for VAPI. Configure VAPI to use:

- **Base URL**: `http://your-server:3001`
- **Endpoint**: `/chat/completions` or `/chat/completions/stream`
- **Model**: Any OpenAI-compatible model name

## MCP Server Tools

The MCP server provides these tools:

### search_conversations
Searches for conversations based on query and optional date filters.

**Parameters:**
- `user_id` (required): User ID to search conversations for
- `query` (required): Search query
- `date_from` (optional): Start date for search
- `date_to` (optional): End date for search
- `limit` (optional): Maximum number of results (default: 10)

### get_conversation_context
Gets detailed context for specific conversations including full transcripts and summaries.

**Parameters:**
- `user_id` (required): User ID
- `conversation_ids` (required): Array of conversation IDs

## Error Handling

The API handles errors gracefully:

- If conversation search fails, it falls back to using the original messages without context
- If the MCP server is unavailable, the system continues to work as a regular LLM API
- All errors are logged for debugging purposes

## Performance Considerations

- Conversation search is limited to the most recent conversations to avoid performance issues
- Transcript length is limited to 2000 characters per conversation to stay within token limits
- Only the top 3 most relevant conversations are used as context
- The system caches nothing currently, but caching could be added for better performance
