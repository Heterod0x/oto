# Conversation LLM Assistant Setup Guide

This guide explains how to set up and use the custom LLM assistant server that can answer questions about historical conversations.

## Overview

The system consists of two main components:

1. **MCP Server** (`src/mcp/`): Provides conversation search and context retrieval from Supabase
2. **LLM API Server** (`src/llmapi/`): OpenAI Agents SDK-powered API that uses MCP tools for conversation context

## Architecture Flow

```
User Query → LLM API Server → MCP Server → Supabase Database
                ↓                ↓              ↓
         Enhanced Context ← Search Results ← Conversations
                ↓
            OpenAI API
                ↓
         Contextual Response
```

## Setup Instructions

### 1. Environment Variables

Add these to your `.env` file:

```bash
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key_here

# LLM API Server Port (optional, defaults to 3002)
LLM_API_PORT=3002

# Supabase Configuration (should already be set)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Install Dependencies

The MCP SDK should already be installed, but if not:

```bash
npm install @modelcontextprotocol/sdk
```

### 3. Build the Project

```bash
npm run build
```

### 4. Running the Servers

#### Development Mode

```bash
# Terminal 1: Run the main voice API server
npm run dev

# Terminal 2: Run the LLM API server
npm run dev:llm

# Terminal 3: (Optional) Run MCP server standalone for testing
npm run dev:mcp
```

#### Production Mode

```bash
# Build first
npm run build

# Terminal 1: Main voice API server
npm start

# Terminal 2: LLM API server
node dist/llmapi/index.js

# Terminal 3: (Optional) MCP server standalone
node dist/mcp/index.js
```

## Usage Examples

### 1. Basic Health Check

```bash
curl http://localhost:3002/health
```

### 2. Simple Chat (No Context)

```bash
curl -X POST http://localhost:3002/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    "model": "gpt-4o-mini"
  }'
```

### 3. Context-Enhanced Chat

```bash
curl -X POST http://localhost:3002/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "What todos did we create in today'\''s meeting?"
      }
    ],
    "model": "gpt-4o-mini",
    "user_id": "your-user-id"
  }'
```

### 4. Streaming Response

```bash
curl -X POST http://localhost:3002/chat/completions/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Summarize our recent project discussions"
      }
    ],
    "model": "gpt-4o-mini",
    "user_id": "your-user-id",
    "stream": true
  }'
```

### 5. Run Test Script

```bash
node examples/llm-api-test.js
```

## Integration with VAPI

To use this as a custom LLM provider for VAPI:

1. **Base URL**: `http://your-server:3001`
2. **Endpoint**: `/chat/completions` (or `/chat/completions/stream` for streaming)
3. **Model**: Any OpenAI-compatible model name
4. **Custom Headers**: Include `user_id` in the request body to enable conversation context

### VAPI Configuration Example

```json
{
  "model": {
    "provider": "custom-llm",
    "url": "http://localhost:3001/chat/completions",
    "model": "gpt-4o-mini"
  },
  "voice": {
    "provider": "11labs",
    "voiceId": "your-voice-id"
  }
}
```

## How It Works

### 1. User Query Processing

When a user asks a question like "What todos did we discuss in today's meeting?":

1. The LLM API receives the chat completion request
2. If `user_id` is provided, it extracts the user's query
3. The system searches for relevant conversations using the MCP server

### 2. Conversation Search

The MCP server:

1. Searches through conversation titles, transcripts, and summaries
2. Ranks results by relevance score
3. Returns the most relevant conversations with previews

### 3. Context Enhancement

The LLM API:

1. Takes the top 3 most relevant conversations
2. Retrieves full context (transcripts, summaries, logs)
3. Builds a comprehensive context string
4. Enhances the system prompt with this context

### 4. Response Generation

1. OpenAI generates a response using the enhanced context
2. The response references specific conversations and timeframes
3. Users get accurate, contextual answers about their historical conversations

## Example Conversation Flow

**User**: "What todos did we create in yesterday's meeting?"

**System Process**:
1. Search conversations for "todos", "yesterday", "meeting"
2. Find relevant conversation from yesterday
3. Extract transcript and todo-related content
4. Enhance prompt with context

**Enhanced Prompt**:
```
You are a helpful assistant that can answer questions about the user's historical conversations.

Here is the relevant conversation context based on the user's query:

--- Conversation 1 (Relevance: 15) ---
Title: Daily Standup Meeting
Date: 12/11/2025
Preview: We discussed the project timeline and created several todos...
Transcript: [User]: We need to finish the API documentation by Friday...
Summaries:
  1. [user]: Created todo to finish API documentation by Friday
  2. [user]: Assigned bug fixes to John for the payment system
...
```

**Response**: "Based on yesterday's Daily Standup Meeting, you created the following todos: 1) Finish API documentation by Friday, 2) Assign bug fixes to John for the payment system..."

## Troubleshooting

### Common Issues

1. **MCP Server Not Found**
   - Ensure the project is built: `npm run build`
   - Check that `dist/mcp/index.js` exists

2. **No Conversation Context**
   - Verify `user_id` is included in requests
   - Check that conversations exist in the database for that user
   - Ensure Supabase credentials are correct

3. **OpenAI API Errors**
   - Verify `OPENAI_API_KEY` is set correctly
   - Check API quota and billing

4. **Database Connection Issues**
   - Verify Supabase URL and service role key
   - Check database schema matches expected structure

### Debug Mode

To enable debug logging, set:

```bash
NODE_ENV=development
```

### Testing the MCP Server Directly

```bash
# Run MCP server in stdio mode
node dist/mcp/index.js

# Send a test request (in another terminal)
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_conversations","arguments":{"user_id":"test","query":"meeting"}}}' | node dist/mcp/index.js
```

## Performance Considerations

- **Search Scope**: Limited to recent conversations to avoid performance issues
- **Context Size**: Transcript length limited to 2000 characters per conversation
- **Relevance Limit**: Only top 3 conversations used as context
- **Caching**: Consider adding Redis caching for frequently accessed conversations

## Security Considerations

- **User Isolation**: Row Level Security (RLS) ensures users only access their own conversations
- **API Keys**: Store OpenAI API key securely
- **Input Validation**: All user inputs are validated before processing
- **Rate Limiting**: Consider adding rate limiting for production use

## Future Enhancements

1. **Semantic Search**: Use embeddings for better conversation matching
2. **Caching Layer**: Add Redis for improved performance
3. **Real-time Updates**: WebSocket support for live conversation updates
4. **Advanced Filtering**: Date ranges, conversation types, participants
5. **Analytics**: Track query patterns and conversation relevance
