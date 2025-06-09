# Oto Voice API Client

A comprehensive web application for testing all functionalities of the Oto Voice API server. This client provides a user-friendly interface to interact with the voice API's REST endpoints and WebSocket connections for real-time audio streaming and transcription.

## Features

### 🎙️ Audio Recording & Real-time Transcription
- WebSocket-based audio streaming
- Real-time speech-to-text transcription
- Live action detection (todo, calendar, research)
- Audio recording controls with visual feedback

### 📋 Actions Management
- List and filter actions by type, status, and conversation
- Update action status (created → accepted → completed)
- View detected actions with transcript context
- Real-time action detection display

### 💬 Conversations Management
- Browse all conversations with status indicators
- View full transcripts in multiple formats (plain, SRT, VTT)
- Access conversation logs with speaker identification
- Download audio files

### ⚙️ Configuration & Monitoring
- Configurable API endpoints and authentication
- Real-time server health monitoring
- Error tracking and display
- Responsive design for desktop and mobile

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Running Oto Voice API server

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3001`

### Configuration

Click the "Configuration" button in the header to set up your API connection:

- **Base URL**: The URL of your Oto Voice API server (default: `http://localhost:3000`)
- **User ID**: Your user identifier for authentication (default: `test-user-123`)
- **Auth Token**: Bearer token for API authentication (default: `Bearer test-token`)

## Usage Guide

### 1. Audio Recording Tab

**Setup:**
1. Configure your API settings
2. Enter a conversation ID (or use the default)
3. Click "Connect to WebSocket"

**Recording:**
1. Click "Start Recording" to begin audio capture
2. Speak naturally - you'll see real-time transcription
3. Actions will be automatically detected and displayed
4. Click "Stop Recording" when finished

**Features:**
- Live transcript display
- Real-time action detection
- Recording status indicators
- Audio permission handling

### 2. Actions Tab

**Viewing Actions:**
- See all detected actions from conversations
- Filter by type (todo, calendar, research)
- Filter by status (created, accepted, completed, deleted)
- Filter by conversation ID

**Managing Actions:**
- Accept newly created actions
- Mark accepted actions as completed
- Delete unwanted actions
- View action details and transcript context

### 3. Conversations Tab

**Browsing Conversations:**
- View all conversations with metadata
- See conversation status (active/archived)
- Preview transcript excerpts
- Select conversations for detailed view

**Conversation Details:**
- View full transcripts in different formats
- Access conversation logs with timestamps
- See speaker identification
- Download audio files

## API Integration

The client integrates with all Oto Voice API endpoints:

### REST API Endpoints
- `GET /health` - Server health check
- `GET /` - API information
- `GET /actions` - List actions with filtering
- `GET /action/:id` - Get specific action
- `PATCH /action/:id` - Update action status
- `GET /conversations` - List conversations
- `GET /conversation/:id/audio_url` - Get audio URL
- `GET /conversation/:id/transcript` - Get transcript
- `GET /conversation/:id/logs` - Get conversation logs

### WebSocket Connection
- `/conversation/:id/stream` - Real-time audio streaming
- Handles audio data transmission
- Receives transcription updates
- Receives action detection events

## Development

### Project Structure
```
client/
├── src/
│   ├── components/          # React components
│   │   ├── AudioRecorder.tsx
│   │   ├── ActionsList.tsx
│   │   ├── ConversationsList.tsx
│   │   └── ConfigPanel.tsx
│   ├── services/           # API and WebSocket services
│   │   ├── api.ts
│   │   └── websocket.ts
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Styles
├── public/                 # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Lucide React** - Icons
- **CSS3** - Styling with modern features

## Testing the Server

This client is designed to comprehensively test all server functionalities:

### Audio Streaming Tests
1. Connect to WebSocket endpoint
2. Stream audio data in real-time
3. Verify transcription accuracy
4. Test action detection algorithms

### REST API Tests
1. Authentication with custom headers
2. CRUD operations on actions
3. Conversation data retrieval
4. Error handling and validation

### Integration Tests
1. End-to-end conversation flow
2. Real-time data synchronization
3. Multi-format transcript export
4. Audio file access

## Troubleshooting

### Common Issues

**WebSocket Connection Failed:**
- Verify server is running on correct port
- Check authentication headers
- Ensure conversation ID exists

**Audio Recording Not Working:**
- Grant microphone permissions
- Check browser compatibility
- Verify HTTPS for production

**API Requests Failing:**
- Verify base URL configuration
- Check authentication token
- Review server logs for errors

### Browser Compatibility

- Chrome 88+ (recommended)
- Firefox 85+
- Safari 14+
- Edge 88+

### Network Requirements

- WebSocket support
- Microphone access
- CORS enabled on server
- Stable internet connection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request