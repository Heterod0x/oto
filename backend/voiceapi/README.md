# Oto Voice API

Oto Voice API turns spoken words into structured data and lets you keep every conversation—and its follow-ups—fully accessible and actionable.

## Features

- **Real-time Audio Streaming**: Stream live audio via WebSocket and get real-time speech-to-text
- **Automatic Action Detection**: Extract to-do items, calendar events, and research queries from conversations
- **Action Management**: Query, update, and track actions over REST API
- **Conversation Management**: List past calls, download raw audio, grab full transcripts, or pull quick summary logs

## Architecture

The Oto Voice API has two main interfaces:

- **WebSocket** – for real-time audio streaming, transcription, and action detection
- **REST** – for browsing and updating actions and conversations

## Prerequisites

- Node.js 18+ and npm
- Supabase account and database
- AssemblyAI API key
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd oto-voice-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AssemblyAI Configuration
ASSEMBLYAI_API_KEY=your_assemblyai_api_key

# OpenAI Configuration (for action detection)
OPENAI_API_KEY=your_openai_api_key

# API Configuration
OTO_API_KEY_SECRET=your_secret_for_api_key_validation
```

4. Set up the database:
   - Create a new Supabase project
   - Run the SQL schema from `database/schema.sql` in your Supabase SQL editor

5. Build the project:
```bash
npm run build
```

6. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

### Authentication

All API requests require authentication headers:

```
Authorization: Bearer YOUR_API_KEY
OTO_USER_ID: your_user_id
```

### WebSocket Audio Streaming

Connect to: `ws://localhost:3000/conversation/{conversation_id}/stream`

#### Send Messages

**Audio Data:**
```json
{
  "type": "audio",
  "data": "base64_encoded_audio_data"
}
```

**Complete Conversation:**
```json
{
  "type": "complete"
}
```

#### Receive Messages

**Transcription:**
```json
{
  "type": "transcribe",
  "data": {
    "finalized": false,
    "transcript": "Hi, ..."
  }
}
```

**Detected Action:**
```json
{
  "type": "detect-action",
  "data": {
    "type": "todo",
    "id": "uuid",
    "inner": {
      "title": "Buy lunch",
      "body": "Go to the store"
    },
    "relate": {
      "start": 3600,
      "end": 3700,
      "transcript": "..."
    }
  }
}
```

### REST API Endpoints

#### Actions

- `GET /actions` - List actions
  - Query params: `conversation_id`, `status`, `type`
- `GET /action/{action_id}` - Get specific action
- `PATCH /action/{action_id}` - Update action status

#### Conversations

- `GET /conversations` - List conversations
  - Query params: `status`, `updated_since`, `limit`, `offset`
- `GET /conversation/{conversation_id}/audio_url` - Get audio download URL
- `GET /conversation/{conversation_id}/transcript` - Get full transcript
  - Query params: `format` (plain, srt, vtt)
- `GET /conversation/{conversation_id}/logs` - Get conversation summary logs
  - Query params: `limit`, `offset`

## Web Client Application

A comprehensive web client is available in the `./client` directory for testing all server functionalities with a user-friendly interface.

### Quick Start with Client

1. **Start the server** (in the root directory):
```bash
npm run dev
```

2. **Start the client** (in a new terminal):
```bash
cd client
npm install
npm run dev
```

3. **Open your browser** and navigate to `http://localhost:3001`

### Client Features

- **🎙️ Real-time Audio Recording**: WebSocket-based audio streaming with live transcription
- **📋 Actions Management**: View, filter, and manage detected actions
- **💬 Conversations Browser**: Browse conversations, view transcripts, and download audio
- **⚙️ Configuration Panel**: Easy API endpoint and authentication setup
- **📊 Real-time Monitoring**: Server health status and error tracking

See `./client/README.md` for detailed client documentation.

## Usage Example

### 1. Using the Web Client (Recommended)

The easiest way to test the API is using the web client:

1. Start both server and client as described above
2. Configure API settings in the client interface
3. Use the audio recorder to test real-time transcription
4. Browse actions and conversations through the UI

### 2. Direct API Usage

#### Create a Conversation

First, create a conversation in your database (you can do this via Supabase dashboard or add an endpoint).

#### Start Audio Streaming

```javascript
const ws = new WebSocket('ws://localhost:3000/conversation/your-conversation-id/stream', {
  headers: {
    'Authorization': 'Bearer your-api-key',
    'OTO_USER_ID': 'your-user-id'
  }
});

ws.on('open', () => {
  console.log('Connected to audio stream');
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  
  if (message.type === 'transcribe') {
    console.log('Transcript:', message.data.transcript);
  } else if (message.type === 'detect-action') {
    console.log('Action detected:', message.data);
  }
});

// Send audio data (base64 encoded)
ws.send(JSON.stringify({
  type: 'audio',
  data: base64AudioData
}));

// Complete the conversation
ws.send(JSON.stringify({
  type: 'complete'
}));
```

### 3. Manage Actions

```javascript
// List all actions
const response = await fetch('/actions', {
  headers: {
    'Authorization': 'Bearer your-api-key',
    'OTO_USER_ID': 'your-user-id'
  }
});
const { actions } = await response.json();

// Update action status
await fetch(`/action/${actionId}`, {
  method: 'PATCH',
  headers: {
    'Authorization': 'Bearer your-api-key',
    'OTO_USER_ID': 'your-user-id',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    status: 'completed'
  })
});
```

## Development

### Project Structure

```
src/
├── config/           # Configuration management
├── middleware/       # Express middleware (auth, validation)
├── routes/          # REST API routes
├── services/        # Business logic services
├── types/           # TypeScript type definitions
├── websocket/       # WebSocket handlers
└── index.ts         # Main server file
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)

### Adding New Features

1. Define types in `src/types/index.ts`
2. Add business logic in `src/services/`
3. Create routes in `src/routes/`
4. Add middleware if needed in `src/middleware/`
5. Update the main server file if necessary

## Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production database URLs
3. Set up proper CORS origins
4. Use environment-specific API keys

### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
```

## Monitoring

The API includes several monitoring endpoints:

- `GET /health` - Health check with active WebSocket sessions count
- `GET /` - API documentation and available endpoints

## Troubleshooting

### Common Issues

1. **WebSocket connection fails**: Check authentication headers and conversation ID format
2. **Transcription not working**: Verify AssemblyAI API key and audio format
3. **Actions not detected**: Check OpenAI API key and ensure transcript has actionable content
4. **Database errors**: Verify Supabase configuration and RLS policies

### Logs

The server logs important events:
- WebSocket connections and disconnections
- Transcription events
- Action detection results
- Database operations
- Errors and warnings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request