import express, { Request, Response } from 'express';
import cors from 'cors';
import { ConversationAgentService } from './services/ConversationAgentService';
import dotenv from 'dotenv';
import fs from 'fs';

const app = express();

// load from .env
if (fs.existsSync('/etc/secrets/.env')) {
  dotenv.config({ path: '/etc/secrets/.env' });
} else {
  dotenv.config();
}

const port = process.env.LLM_API_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the conversation agent service
const conversationAgentService = new ConversationAgentService();

const completionNoStream = async (req: Request, res: Response) => {
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
};

const completionStream = async (req: Request, res: Response) => {
  try {
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
};

app.get("/health", (req, res) => {
  res.json({ status: 'ok', service: 'conversation-llm-api' });
});

// Basic chat completions endpoint (non-streaming)
app.post('/chat/completions', async (req, res) => {
  if (req.body.stream) {
    await completionStream(req, res);
  } else {
    await completionNoStream(req, res);
  }
});

// Streaming chat completions endpoint
app.post('/chat/completions/stream', async (req, res) => {
  await completionStream(req, res);
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
