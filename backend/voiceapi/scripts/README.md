# Voice API Testing Scripts

This directory contains testing scripts for the Voice API server.

## Workflow Test Suite

The `workflow-test/` directory contains a comprehensive, modular testing framework that simulates the complete typical workflow for the Voice API server.

### Quick Start

```bash
# Run the complete workflow test
npm run test:workflow

# With custom configuration
SERVER_URL=http://localhost:8080 npm run test:workflow
```

### What it tests:

1. **WebSocket Audio Streaming** - Opens a WebSocket connection to `/conversation/{id}/stream` and streams mock audio data
2. **Live Transcription** - Receives real-time transcription updates from the server
3. **Action Detection** - Receives detected action objects (todo, calendar, research items)
4. **Action Management** - Fetches all detected actions via GET `/actions?conversation_id={id}`
5. **Action Lifecycle Updates** - Updates action statuses via PATCH `/action/{id}` (accepted, completed, deleted)
6. **Conversation Finalization** - Completes the audio stream and retrieves final data
7. **Data Retrieval** - Fetches final transcript, audio URL, and conversation logs

### Architecture

The test suite is organized into a clean, modular structure:

```
workflow-test/
├── index.ts                    # Main entry point
├── workflow-tester.ts          # Core test orchestrator
├── config.ts                   # Configuration management
├── types.ts                    # TypeScript definitions
├── services/
│   ├── api-client.ts          # REST API client
│   └── websocket-client.ts    # WebSocket client
└── utils/
    ├── logger.ts              # Logging utilities
    ├── audio-generator.ts     # Mock audio generation
    └── action-simulator.ts    # User interaction simulation
```

### Key Features

- **Modular Design**: Clean separation of concerns with dedicated classes for each responsibility
- **Comprehensive Testing**: Tests the complete workflow from audio streaming to data retrieval
- **Realistic Simulation**: Generates proper audio data and simulates realistic user interactions
- **Robust Error Handling**: Graceful handling of connection failures and partial test failures
- **Detailed Logging**: Structured logging with timestamps and categorization
- **Configurable**: Environment variable configuration for different test scenarios
- **Extensible**: Easy to extend with custom test steps and behaviors

### Configuration

Environment variables for customization:

```bash
SERVER_URL=http://localhost:3000    # Server base URL
API_KEY=your-api-key               # Authentication key
USER_ID=your-user-id               # User identifier
```

### Programmatic Usage

```typescript
import { WorkflowTester, createTestConfig } from './workflow-test';

const config = createTestConfig();
const tester = new WorkflowTester(config);

const results = await tester.runWorkflowTest();
console.log('Test completed:', results);
```

For detailed documentation, see [workflow-test/README.md](workflow-test/README.md).

## Other Scripts

- `test-server.js` - Basic server testing utilities
