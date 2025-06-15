# Multi-Provider Transcription Service

This directory contains the abstracted transcription service that supports multiple Speech-to-Text (STT) providers.

## Architecture

The transcription service follows a provider pattern with the following components:

### Core Components

- **`BaseSTTProvider`**: Abstract base class that defines the interface all STT providers must implement
- **`ProviderFactory`**: Factory class for creating and managing STT provider instances
- **`TranscriptionService`**: Main service class that uses providers and forwards events
- **`types.ts`**: TypeScript interfaces and enums for the transcription system

### Supported Providers

1. **AssemblyAI** (`assemblyai`)
   - Real-time streaming transcription
   - File-based transcription
   - High accuracy with word-level timestamps

2. **Google Cloud Speech-to-Text** (`google-cloud`)
   - Real-time streaming transcription with automatic restarts
   - File-based transcription
   - Supports multiple languages and audio formats

## Configuration

### Environment Variables

```bash
# Choose your STT provider
STT_PROVIDER=assemblyai  # Options: 'assemblyai' or 'google-cloud'

# AssemblyAI Configuration
ASSEMBLYAI_API_KEY=your_assemblyai_api_key

# Google Cloud Speech-to-Text Configuration
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_CLOUD_KEY_FILENAME=path/to/your/service-account-key.json
```

### Provider-Specific Setup

#### AssemblyAI
1. Sign up at [AssemblyAI](https://www.assemblyai.com/)
2. Get your API key from the dashboard
3. Set `ASSEMBLYAI_API_KEY` in your environment

#### Google Cloud Speech-to-Text
1. Create a Google Cloud Project
2. Enable the Speech-to-Text API
3. Create a service account and download the JSON key file
4. Set `GOOGLE_CLOUD_PROJECT_ID` and `GOOGLE_CLOUD_KEY_FILENAME`

## Usage

### Basic Usage

```typescript
import { transcriptionService } from './services/transcription';

// Start real-time transcription
await transcriptionService.startRealtimeTranscription();

// Listen for events
transcriptionService.on('connected', (event) => {
  console.log('Connected:', event);
});

transcriptionService.on('partial-transcript', (event) => {
  console.log('Partial:', event.text);
});

transcriptionService.on('final-transcript', (event) => {
  console.log('Final:', event.text);
});

// Send audio data
transcriptionService.sendAudioData(audioBuffer);

// Stop transcription
const finalTranscript = await transcriptionService.stopRealtimeTranscription();
```

### Switching Providers

```typescript
import { transcriptionService, STTProvider } from './services/transcription';

// Switch to Google Cloud
await transcriptionService.switchProvider(STTProvider.GOOGLE_CLOUD);

// Switch back to AssemblyAI
await transcriptionService.switchProvider(STTProvider.ASSEMBLYAI);

// Get current provider
const currentProvider = transcriptionService.getCurrentProvider();

// Get available providers
const availableProviders = transcriptionService.getAvailableProviders();
```

### File Transcription

```typescript
// Transcribe an audio file
const result = await transcriptionService.transcribeAudioFile('https://example.com/audio.wav');
console.log('Transcription:', result.text);
console.log('Confidence:', result.confidence);
console.log('Words:', result.words);
```

### Subtitle Generation

```typescript
// Convert to SRT format
const srtContent = transcriptionService.convertToSRT(transcript, words);

// Convert to VTT format
const vttContent = transcriptionService.convertToVTT(transcript, words);
```

## Events

The transcription service emits the following events:

- **`connected`**: Fired when the STT provider connects successfully
- **`disconnected`**: Fired when the STT provider disconnects
- **`partial-transcript`**: Fired for interim transcription results
- **`final-transcript`**: Fired for finalized transcription results
- **`error`**: Fired when an error occurs

## Adding New Providers

To add a new STT provider:

1. Create a new provider class extending `BaseSTTProvider`
2. Implement all abstract methods
3. Add the provider to the `STTProvider` enum in `types.ts`
4. Update the `ProviderFactory` to handle the new provider
5. Add configuration support in the main `TranscriptionService`

### Example Provider Implementation

```typescript
import { BaseSTTProvider } from '../BaseSTTProvider';
import { TranscriptionResult, STTProviderConfig } from '../types';

export class MyCustomProvider extends BaseSTTProvider {
  constructor(config: STTProviderConfig) {
    super(config);
    // Initialize your provider
  }

  async startRealtimeTranscription(): Promise<void> {
    // Implement real-time transcription start
  }

  sendAudioData(audioData: Buffer): void {
    // Implement audio data sending
  }

  async stopRealtimeTranscription(): Promise<string> {
    // Implement real-time transcription stop
  }

  async transcribeAudioFile(audioUrl: string): Promise<TranscriptionResult> {
    // Implement file transcription
  }
}
```

## Audio Format Requirements

### AssemblyAI
- Sample Rate: 16kHz (recommended)
- Encoding: PCM
- Channels: Mono
- Format: Raw audio bytes

### Google Cloud Speech-to-Text
- Sample Rate: 16kHz (recommended)
- Encoding: LINEAR16
- Channels: Mono
- Format: Raw audio bytes

## Error Handling

The service includes comprehensive error handling:

- Provider connection failures
- Audio streaming errors
- API rate limiting
- Network connectivity issues
- Invalid configuration

All errors are emitted through the `error` event and logged to the console.

## Performance Considerations

- **Buffer Management**: Audio data is buffered when providers are not connected
- **Stream Restarts**: Google Cloud provider automatically restarts streams to handle long sessions
- **Memory Usage**: Providers clean up resources when stopped
- **Concurrent Sessions**: Each service instance supports one active transcription session

## Testing

The transcription service can be tested with different providers:

```typescript
import { TranscriptionService, STTProvider } from './services/transcription';

// Test with AssemblyAI
const assemblyService = new TranscriptionService(STTProvider.ASSEMBLYAI);

// Test with Google Cloud
const googleService = new TranscriptionService(STTProvider.GOOGLE_CLOUD);
