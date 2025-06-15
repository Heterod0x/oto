# Oto Voice API Client

A React-based client application for the Oto Voice API that provides real-time audio recording, transcription, and action detection capabilities.

## Environment Configuration

The client application uses Vite environment variables for configuration. These variables allow you to customize the API connection settings without modifying the source code.

### Environment Variables

Create a `.env` file in the client directory with the following variables:

```bash
# API Base URL - The backend server URL
VITE_API_BASE_URL=http://localhost:3000

# Default User ID - The user identifier for API requests
VITE_DEFAULT_USER_ID=test-user-123

# Auth Token - Bearer token for API authentication
VITE_AUTH_TOKEN=Bearer your-auth-token-here
```

### Setting Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your specific configuration:
   - `VITE_API_BASE_URL`: Set this to your backend server URL
   - `VITE_DEFAULT_USER_ID`: Set this to your default user identifier
   - `VITE_AUTH_TOKEN`: Set this to your authentication token

### Environment Variable Naming

All Vite environment variables must be prefixed with `VITE_` to be accessible in the client-side code. This is a security feature that prevents accidentally exposing server-side environment variables to the client.

### Fallback Values

If environment variables are not set, the application will use the following default values:
- Base URL: `http://localhost:3000`
- User ID: `test-user-123`
- Auth Token: `Bearer cHLnhvOEr8l6RkvEwjAk4sjN5XgES`

## Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3001`.

### Building for Production

```bash
npm run build
```

### Environment-Specific Builds

You can create different environment files for different deployment environments:

- `.env.local` - Local development overrides
- `.env.development` - Development environment
- `.env.production` - Production environment

Vite will automatically load the appropriate environment file based on the current mode.

## Features

- **Real-time Audio Recording**: Record audio directly in the browser
- **Live Transcription**: Get real-time transcription of recorded audio
- **Action Detection**: Automatically detect and categorize actions from transcripts
- **Conversation Management**: View and manage conversation history
- **WebSocket Integration**: Real-time communication with the backend server

## Configuration Panel

The application includes a configuration panel that allows you to modify the API settings at runtime. However, using environment variables is the recommended approach for consistent configuration across deployments.

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already included in `.gitignore`
- Use `.env.example` as a template for other developers
- Rotate authentication tokens regularly
- Use HTTPS in production environments
