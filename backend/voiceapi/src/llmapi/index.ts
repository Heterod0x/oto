import express from 'express';
import cors from 'cors';
import { ConversationAgentService } from './services/ConversationAgentService';
import dotenv from 'dotenv';

const app = express();

// load from .env
dotenv.config();

const port = process.env.LLM_API_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the conversation agent service
const conversationAgentService = new ConversationAgentService();

// Basic chat completions endpoint (non-streaming)
app.post('/chat/completions', async (req, res) => {
  try {
    const response = await conversationAgentService.handleChatCompletion(req.body);
    res.json(response);
  } catch (error) {
    console.error('Error in chat completions:', error);
    res.status(500).json({
      error: {
        message: error instanceof Error ? error.message : 'Internal server error',
        type: 'internal_error',
      },
    });
  }
});

// Streaming chat completions endpoint
app.post('/chat/completions/stream', async (req, res) => {
  try {
    // Set headers for Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

    await conversationAgentService.handleStreamingChatCompletion(req.body, res);
  } catch (error) {
    console.error('Error in streaming chat completions:', error);
    res.write(`data: ${JSON.stringify({
      error: {
        message: error instanceof Error ? error.message : 'Internal server error',
        type: 'internal_error',
      },
    })}\n\n`);
    res.end();
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'conversation-llm-api' });
});

// Start server
app.listen(port, () => {
  console.log(`Conversation LLM API server running on port ${port}`);
});

export default app;
