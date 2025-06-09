import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/validation';
import { audioStreamHandler } from './websocket/audioStream';
import actionsRouter from './routes/actions';
import conversationsRouter from './routes/conversations';

export function createApp(): express.Application {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "wss:", "ws:"],
      },
    },
  }));

  // CORS configuration
  app.use(cors({
    origin: config.nodeEnv === 'production' 
      ? ['https://yourdomain.com'] // Replace with your actual domain
      : true, // Allow all origins in development
    credentials: true,
  }));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // JSON parsing error handler
  app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (error instanceof SyntaxError && 'body' in error) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid JSON in request body',
      });
      return;
    }
    next(error);
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      activeWebSocketSessions: audioStreamHandler.getActiveSessionsCount(),
    });
  });

  // API documentation endpoint
  app.get('/', (req, res) => {
    res.json({
      name: 'Oto Voice API',
      version: '1.0.0',
      description: 'Turn spoken words into structured data',
      endpoints: {
        websocket: '/conversation/{id}/stream',
        rest: {
          actions: {
            list: 'GET /actions',
            get: 'GET /action/{id}',
            update: 'PATCH /action/{id}',
          },
          conversations: {
            list: 'GET /conversations',
            audioUrl: 'GET /conversation/{id}/audio_url',
            transcript: 'GET /conversation/{id}/transcript',
            logs: 'GET /conversation/{id}/logs',
          },
        },
        authentication: {
          headers: ['Authorization', 'OTO_USER_ID'],
        },
      },
    });
  });

  // Apply authentication middleware to all API routes
  app.use('/actions', authMiddleware);
  app.use('/action', authMiddleware);
  app.use('/conversations', authMiddleware);
  app.use('/conversation', authMiddleware);

  // API routes
  app.use('/actions', actionsRouter);
  app.use('/action', actionsRouter);
  app.use('/conversations', conversationsRouter);
  app.use('/conversation', conversationsRouter);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    });
  });

  // Error handling middleware
  app.use(errorHandler);

  return app;
}
