# Voice API Workflow Test Example

This document provides a complete example of how to use the workflow testing script.

## Quick Start

1. **Start your Voice API server:**
   ```bash
   npm run dev
   ```

2. **Run the workflow test:**
   ```bash
   npm run test:workflow
   ```

## Expected Output

When you run the workflow test, you should see output similar to this:

```
[2024-01-15T10:30:00.000Z] 🚀 Starting Voice API Workflow Test
[2024-01-15T10:30:00.001Z] 📝 Conversation ID: 123e4567-e89b-12d3-a456-426614174000

=== STEP 1: Audio Streaming ===
[2024-01-15T10:30:00.002Z] 🔌 Connecting to WebSocket: ws://localhost:3000/conversation/123e4567-e89b-12d3-a456-426614174000/stream
[2024-01-15T10:30:00.050Z] ✅ WebSocket connection established
[2024-01-15T10:30:00.051Z] 📤 Sent audio chunk 1/50
[2024-01-15T10:30:00.151Z] 📤 Sent audio chunk 2/50
[2024-01-15T10:30:00.152Z] 📝 Received transcription update:
{
  "finalized": false,
  "transcript": "Hello, I need to"
}
[2024-01-15T10:30:00.251Z] 📤 Sent audio chunk 3/50
...
[2024-01-15T10:30:05.000Z] 📤 Sent completion message
[2024-01-15T10:30:05.001Z] 📝 Received transcription update:
{
  "finalized": true,
  "transcript": "Hello, I need to schedule a meeting with John tomorrow at 2 PM and research the latest market trends."
}
[2024-01-15T10:30:05.002Z] 🎯 Detected action:
{
  "type": "calendar",
  "id": "action-456",
  "inner": {
    "title": "Meeting with John",
    "datetime": "2024-01-16T14:00:00Z"
  },
  "relate": {
    "start": 1500,
    "end": 3200,
    "transcript": "schedule a meeting with John tomorrow at 2 PM"
  }
}
[2024-01-15T10:30:05.003Z] 🎯 Detected action:
{
  "type": "research",
  "id": "action-789",
  "inner": {
    "title": "Research market trends",
    "query": "latest market trends"
  },
  "relate": {
    "start": 3500,
    "end": 5000,
    "transcript": "research the latest market trends"
  }
}
[2024-01-15T10:30:06.000Z] 🔌 WebSocket closed: 1000 - 

=== STEP 2: List Detected Actions ===
[2024-01-15T10:30:08.001Z] 📋 Fetching actions for conversation: 123e4567-e89b-12d3-a456-426614174000
[2024-01-15T10:30:08.050Z] 📋 Retrieved actions:
[
  {
    "id": "action-456",
    "type": "calendar",
    "status": "created",
    "inner": {
      "title": "Meeting with John",
      "datetime": "2024-01-16T14:00:00Z"
    },
    "relate": {
      "start": 1500,
      "end": 3200,
      "transcript": "schedule a meeting with John tomorrow at 2 PM"
    }
  },
  {
    "id": "action-789",
    "type": "research",
    "status": "created",
    "inner": {
      "title": "Research market trends",
      "query": "latest market trends"
    },
    "relate": {
      "start": 3500,
      "end": 5000,
      "transcript": "research the latest market trends"
    }
  }
]

=== STEP 3: Update Action Statuses ===
[2024-01-15T10:30:08.051Z] 🔄 Updating action action-456 status to: accepted
[2024-01-15T10:30:08.100Z] ✅ Action updated:
{
  "id": "action-456",
  "status": "accepted",
  "updated_at": "2024-01-15T10:30:08.100Z"
}
[2024-01-15T10:30:08.601Z] 🔄 Updating action action-789 status to: accepted
[2024-01-15T10:30:08.650Z] ✅ Action updated:
{
  "id": "action-789",
  "status": "accepted",
  "updated_at": "2024-01-15T10:30:08.650Z"
}

=== STEP 4: Retrieve Final Data ===
[2024-01-15T10:30:09.151Z] 📄 Fetching final transcript for conversation: 123e4567-e89b-12d3-a456-426614174000
[2024-01-15T10:30:09.200Z] 📄 Final transcript:
{
  "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
  "format": "plain",
  "transcript": "Hello, I need to schedule a meeting with John tomorrow at 2 PM and research the latest market trends."
}
[2024-01-15T10:30:09.201Z] 🎵 Fetching audio URL for conversation: 123e4567-e89b-12d3-a456-426614174000
[2024-01-15T10:30:09.250Z] 🎵 Audio URL:
{
  "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
  "audio_url": "https://storage.example.com/audio/123e4567-e89b-12d3-a456-426614174000.wav"
}
[2024-01-15T10:30:09.251Z] 📊 Fetching conversation logs: 123e4567-e89b-12d3-a456-426614174000
[2024-01-15T10:30:09.300Z] 📊 Conversation logs:
{
  "conversation_id": "123e4567-e89b-12d3-a456-426614174000",
  "logs": [
    {
      "start": 0,
      "end": 5000,
      "speaker": "user",
      "summary": "User requested to schedule a meeting and research market trends",
      "transcript_excerpt": "Hello, I need to schedule a meeting with John tomorrow at 2 PM and research the latest market trends."
    }
  ]
}

=== WORKFLOW TEST SUMMARY ===
[2024-01-15T10:30:09.301Z] ✅ Conversation ID: 123e4567-e89b-12d3-a456-426614174000
[2024-01-15T10:30:09.302Z] ✅ Actions detected: 2
[2024-01-15T10:30:09.303Z] ✅ Final transcript length: 89 characters
[2024-01-15T10:30:09.304Z] 🎉 Workflow test completed successfully!
```

## Configuration Options

You can customize the test by setting environment variables:

```bash
# Test against a different server
export SERVER_URL="http://localhost:8080"

# Use different authentication
export API_KEY="your-production-api-key"
export USER_ID="your-test-user-id"

# Run the test
npm run test:workflow
```

## What Gets Tested

The workflow test validates:

1. **WebSocket Connection** - Ensures the server accepts WebSocket connections
2. **Audio Streaming** - Tests real-time audio data transmission
3. **Live Transcription** - Verifies transcription updates are received
4. **Action Detection** - Confirms actions are detected and formatted correctly
5. **REST API Endpoints** - Tests all conversation and action management endpoints
6. **Action Lifecycle** - Validates action status updates work properly
7. **Data Persistence** - Ensures conversation data is stored and retrievable

## Troubleshooting

### Common Issues

1. **Connection Refused**
   ```
   ❌ WebSocket error: Error: connect ECONNREFUSED 127.0.0.1:3000
   ```
   **Solution:** Make sure your server is running on the correct port.

2. **Authentication Failed**
   ```
   HTTP 401: Unauthorized
   ```
   **Solution:** Check your API_KEY and USER_ID environment variables.

3. **No Actions Detected**
   ```
   ✅ Actions detected: 0
   ```
   **Solution:** This is normal if your action detection service isn't configured or if the mock audio doesn't trigger any actions.

### Debug Mode

For more detailed logging, you can modify the script to include debug information:

```bash
# Enable debug logging (if implemented)
export DEBUG=true
npm run test:workflow
```

## Integration with CI/CD

You can use this script in your continuous integration pipeline:

```yaml
# .github/workflows/test.yml
name: API Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm start &
      - run: sleep 5  # Wait for server to start
      - run: npm run test:workflow
        env:
          API_KEY: ${{ secrets.TEST_API_KEY }}
          USER_ID: test-ci-user
```

This ensures your voice API workflow continues to work correctly with every code change.
