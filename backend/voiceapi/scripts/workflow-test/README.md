# Voice API Workflow Test Suite

A comprehensive, modular testing framework for the Voice API server that simulates the complete typical workflow.

## Architecture

The test suite is organized into a clean, modular structure:

```
scripts/workflow-test/
├── index.ts                    # Main entry point and exports
├── workflow-tester.ts          # Core test orchestrator
├── config.ts                   # Configuration management
├── types.ts                    # TypeScript type definitions
├── services/
│   ├── api-client.ts          # REST API client
│   └── websocket-client.ts    # WebSocket client
└── utils/
    ├── logger.ts              # Logging utilities
    ├── audio-generator.ts     # Mock audio data generation
    └── action-simulator.ts    # User interaction simulation
```

## Components

### Core Classes

#### `WorkflowTester`
The main orchestrator that coordinates the entire test workflow:
- Manages test lifecycle
- Coordinates between different services
- Handles error recovery
- Generates test results

#### `ApiClient`
Handles all REST API interactions:
- Action management (list, update)
- Conversation data retrieval (transcript, audio, logs)
- Proper error handling and logging

#### `WebSocketClient`
Manages WebSocket connections and audio streaming:
- Real-time audio data transmission
- Message handling (transcription, action detection)
- Connection lifecycle management

### Utilities

#### `Logger`
Centralized logging with timestamps and categorization:
- Structured logging with JSON support
- Different log levels (info, success, warning, error)
- Section headers for test organization

#### `AudioGenerator`
Generates realistic mock audio data:
- Sine wave pattern generation
- Configurable parameters (frequency, sample rate)
- Base64 encoding for WebSocket transmission

#### `ActionSimulator`
Simulates realistic user interactions:
- Different behavior patterns by action type
- Configurable probabilities for status changes
- Action summary and statistics

## Usage

### Basic Usage

```typescript
import { WorkflowTester, createTestConfig } from './scripts/workflow-test';

const config = createTestConfig();
const tester = new WorkflowTester(config);

const results = await tester.runWorkflowTest();
console.log('Test completed:', results);
```

### Command Line

```bash
# Run the complete workflow test
npm run test:workflow

# With custom configuration
SERVER_URL=http://localhost:8080 npm run test:workflow
```

### Programmatic Usage

```typescript
import { 
  WorkflowTester, 
  createTestConfig, 
  Logger,
  AudioGenerator 
} from './scripts/workflow-test';

// Create custom configuration
const config = createTestConfig();
config.serverUrl = 'http://custom-server:3000';

// Run test with custom setup
const tester = new WorkflowTester(config);
const results = await tester.runWorkflowTest();

// Access detailed results
console.log('Conversation ID:', tester.getConversationId());
console.log('Detected Actions:', tester.getDetectedActions());
console.log('Final Transcript:', tester.getFinalTranscript());
```

## Configuration

### Environment Variables

```bash
SERVER_URL=http://localhost:3000    # Server base URL
API_KEY=your-api-key               # Authentication key
USER_ID=your-user-id               # User identifier
```

### Default Configuration

```typescript
const DEFAULT_CONFIG = {
  CHUNK_SIZE: 1024,              // Audio chunk size in bytes
  TOTAL_CHUNKS: 50,              // Number of chunks to send
  CHUNK_INTERVAL_MS: 100,        // Interval between chunks
  PROCESSING_DELAY_MS: 2000,     // Wait time for server processing
  ACTION_UPDATE_DELAY_MS: 500,   // Delay between action updates
  AUDIO_FREQUENCY: 440,          // Audio frequency (A note)
  SAMPLE_RATE: 44100,           // Audio sample rate
};
```

## Test Workflow

The test suite executes the following steps:

### 1. Audio Streaming
- Establishes WebSocket connection
- Streams mock audio data in real-time
- Handles transcription and action detection responses
- Properly closes the connection

### 2. Action Management
- Retrieves all detected actions
- Logs action summary and statistics
- Simulates realistic user interactions
- Updates action statuses based on type

### 3. Data Retrieval
- Fetches final conversation transcript
- Retrieves audio URL (if available)
- Gets conversation logs and summaries
- Handles cases where data isn't ready yet

### 4. Results Generation
- Compiles comprehensive test results
- Provides success/failure status
- Includes detailed metrics and statistics

## Error Handling

The test suite includes robust error handling:

- **Connection Failures**: Graceful handling of network issues
- **Authentication Errors**: Clear error messages for auth problems
- **Data Not Ready**: Non-blocking retrieval of optional data
- **Partial Failures**: Test continues even if some steps fail
- **Timeout Handling**: Prevents hanging on slow responses

## Extensibility

The modular design makes it easy to extend:

### Adding New Test Steps

```typescript
class CustomWorkflowTester extends WorkflowTester {
  async runWorkflowTest(): Promise<TestResults> {
    // Run standard workflow
    const results = await super.runWorkflowTest();
    
    // Add custom steps
    await this.executeCustomStep();
    
    return results;
  }
  
  private async executeCustomStep(): Promise<void> {
    Logger.section('CUSTOM STEP');
    // Custom test logic here
  }
}
```

### Custom Action Simulation

```typescript
class CustomActionSimulator extends ActionSimulator {
  static determineActionStatus(action: Action): Action['status'] {
    // Custom logic for action status determination
    return 'accepted';
  }
}
```

### Custom Audio Generation

```typescript
class CustomAudioGenerator extends AudioGenerator {
  static generateMockAudioData(): Buffer[] {
    // Generate custom audio patterns
    return [];
  }
}
```

## Testing Best Practices

1. **Run tests in isolation**: Each test gets a unique conversation ID
2. **Handle async operations**: Proper Promise handling throughout
3. **Log comprehensively**: Detailed logging for debugging
4. **Fail gracefully**: Continue testing even when some steps fail
5. **Clean up resources**: Proper WebSocket connection cleanup

## Integration with CI/CD

The test suite is designed for automated testing:

```yaml
# GitHub Actions example
- name: Run Workflow Tests
  run: npm run test:workflow
  env:
    SERVER_URL: http://localhost:3000
    API_KEY: ${{ secrets.TEST_API_KEY }}
    USER_ID: ci-test-user
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Ensure all dependencies are installed
2. **Connection Refused**: Verify server is running on correct port
3. **Authentication Failed**: Check API_KEY and USER_ID values
4. **No Actions Detected**: Normal if action detection isn't configured

### Debug Mode

Enable detailed logging by modifying the Logger class or adding debug flags to the configuration.
