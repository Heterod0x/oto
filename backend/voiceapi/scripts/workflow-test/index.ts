#!/usr/bin/env ts-node

/**
 * Voice API Server Workflow Testing Script
 * 
 * This script simulates the typical workflow:
 * 1. Open WebSocket at /conversation/{id}/stream, stream audio frames
 * 2. Receive live transcribe updates plus detect-action objects
 * 3. Get or filter with GET /actions?conversation_id={id} to see everything detected
 * 4. Update an action's lifecycle (PATCH /action/{id}) as the user confirms, completes, or dismisses it
 * 5. Complete the conversation to finalize the audio stream
 * 6. Retrieve the final transcript or download the audio via the Conversation endpoints
 */

import { createTestConfig } from './config';
import { WorkflowTester } from './workflow-tester';
import { Logger } from './utils/logger';

async function main(): Promise<void> {
  const config = createTestConfig();
  const tester = new WorkflowTester(config);
  
  try {
    const results = await tester.runWorkflowTest();
    
    if (results.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    Logger.error('Test execution failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export for programmatic use
export { WorkflowTester, createTestConfig };
export * from './types';
export * from './utils/logger';
export * from './utils/audio-generator';
export * from './utils/action-simulator';
export * from './services/api-client';
export * from './services/websocket-client';
