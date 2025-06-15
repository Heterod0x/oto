import WebSocket from 'ws';
import { Server } from 'http';
import { IncomingMessage } from 'http';
import { audioStreamHandler } from './audioStream';

export function createWebSocketServer(server: Server): WebSocket.Server {
  const wss = new WebSocket.Server({
    server,
    verifyClient: (info: { req: IncomingMessage }) => {
      // Basic path validation for WebSocket connections
      const url = new URL(info.req.url || '', `http://${info.req.headers.host}`);
      const pathPattern = /^\/conversation\/[a-f0-9-]{36}\/stream$/;
      return pathPattern.test(url.pathname);
    },
  });

  // Handle WebSocket connections
  wss.on('connection', async (ws, req) => {
    try {
      await audioStreamHandler.handleConnection(ws, req);
    } catch (error) {
      console.error('Failed to handle WebSocket connection:', error);
      ws.close(1011, 'Internal server error');
    }
  });

  return wss;
}

export function closeWebSocketServer(wss: WebSocket.Server): Promise<void> {
  return new Promise((resolve) => {
    // Close all WebSocket sessions
    audioStreamHandler.closeAllSessions();
    
    // Close WebSocket server
    wss.close(() => {
      console.log('WebSocket server closed');
      resolve();
    });
  });
}
