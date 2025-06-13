import { createServer, Server } from 'http';
import WebSocket from 'ws';
import { Application } from 'express';
import { config } from './config';
import { createWebSocketServer, closeWebSocketServer } from './websocket/server';

export class OtoServer {
  private httpServer: Server;
  private wsServer: WebSocket.Server;
  private isShuttingDown = false;

  constructor(app: Application) {
    this.httpServer = createServer(app);
    this.wsServer = createWebSocketServer(this.httpServer);
    this.setupGracefulShutdown();
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpServer.listen(config.port, (error?: Error) => {
        if (error) {
          reject(error);
          return;
        }

        console.log(`🚀 Oto Voice API server running on port ${config.port}`);
        console.log(`📡 WebSocket endpoint: ws://localhost:${config.port}/conversation/{id}/stream`);
        console.log(`🌐 REST API: http://localhost:${config.port}`);
        console.log(`💚 Health check: http://localhost:${config.port}/health`);
        
        if (config.nodeEnv === 'development') {
          this.logAvailableEndpoints();
        }

        resolve();
      });
    });
  }

  public async stop(): Promise<void> {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;
    console.log('Starting graceful shutdown...');

    try {
      // Close WebSocket server
      await closeWebSocketServer(this.wsServer);

      // Close HTTP server
      await new Promise<void>((resolve, reject) => {
        this.httpServer.close((error) => {
          if (error) {
            reject(error);
          } else {
            console.log('HTTP server closed');
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Error during shutdown:', error);
      throw error;
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      console.log(`Received ${signal}. Starting graceful shutdown...`);
      
      try {
        await this.stop();
        process.exit(0);
      } catch (error) {
        console.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    // Register shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

    // Clear timeout if graceful shutdown completes
    process.on('exit', () => {
      console.log('Exit event triggered');

      // force exit after 10 seconds
      setTimeout(() => {
        console.log('Force exit after 10 seconds');
        process.exit(0);
      }, 10_000);
    });
  }

  private logAvailableEndpoints(): void {
    console.log('\n📋 Available endpoints:');
    console.log('  GET  /health');
    console.log('  GET  /');
    console.log('  GET  /actions');
    console.log('  GET  /action/{id}');
    console.log('  PATCH /action/{id}');
    console.log('  GET  /conversations');
    console.log('  GET  /conversation/{id}/audio_url');
    console.log('  GET  /conversation/{id}/transcript');
    console.log('  GET  /conversation/{id}/logs');
    console.log('  WS   /conversation/{id}/stream');
  }

  public getHttpServer(): Server {
    return this.httpServer;
  }

  public getWebSocketServer(): WebSocket.Server {
    return this.wsServer;
  }
}
