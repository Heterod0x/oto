import { validateConfig } from './config';
import { createApp } from './app';
import { OtoServer } from './server';

async function main(): Promise<void> {
  try {
    // Validate configuration on startup
    validateConfig();
    console.log('Configuration validated successfully');

    // Create Express app
    const app = createApp();

    // Create and start server
    const server = new OtoServer(app);
    await server.start();

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Unhandled error during startup:', error);
    process.exit(1);
  });
}

// Export the app for testing
export { createApp } from './app';
export { OtoServer } from './server';
