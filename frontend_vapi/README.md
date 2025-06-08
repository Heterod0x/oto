# Oto VAPI Frontend

## 📖 Overview

A Next.js-based frontend application for Oto VAPI (Voice API) that provides voice interaction capabilities with AI agents. This application includes PWA (Progressive Web App) features, wallet integration, and real-time voice streaming.

## 🚀 Features

- **Voice Recording & Streaming**: Real-time voice recording with WebRTC support
- **AI Agent Chat**: Interactive conversations with AI agents
- **PWA Support**: Installable web app with offline capabilities
- **Wallet Integration**: Support for Ethereum and Solana wallets via Privy
- **Task Management**: AI-extracted task display and management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Performance Monitoring**: Built-in performance and system status monitoring

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **State Management**: React hooks and context
- **Voice/Audio**: Web Audio API, MediaRecorder API
- **Wallet**: Privy SDK for wallet connections
- **Development**: Biome for linting and formatting

## 📁 Project Structure

```
frontend_vapi/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── AgentChat.tsx   # Main chat interface
│   ├── TaskList.tsx    # Task management
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useVoiceRecording.ts
│   ├── useMobile.ts
│   └── usePerformance.ts
├── lib/                # Utility libraries
│   ├── api-client.ts   # VAPI client
│   ├── utils.ts        # Helper functions
│   └── types.ts        # Type definitions
├── pages/              # Next.js pages
│   ├── agent.tsx       # Agent chat page
│   ├── tasks.tsx       # Tasks page
│   └── dashboard.tsx   # Dashboard page
└── public/             # Static assets
```

## ⚙️ Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Configure the following environment variables:

```env
# Privy Configuration (for wallet integration)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# VAPI Configuration
NEXT_PUBLIC_VAPI_API_URL=your_vapi_api_url
NEXT_PUBLIC_SESSION_SIGNER_ID=your_session_signer_id
```

### Installation

```bash
# Install dependencies
pnpm install

# Format code
pnpm run format

# Run development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start
```

## 🎯 Usage

### Voice Chat

1. Navigate to `/agent` page
2. Click the microphone button or press spacebar
3. Speak to the AI agent
4. Press the button again to stop recording
5. View AI responses and extracted tasks

### Task Management

1. Navigate to `/tasks` page
2. View tasks extracted from AI conversations
3. Mark tasks as complete
4. Filter and manage your task list

### PWA Installation

- Use the install prompt that appears on supported browsers
- Or manually install via browser menu (Chrome: Menu > Install App)

## 🔧 Development

### Key Components

- **AgentChat**: Main voice interaction interface
- **TaskList**: Task management and display
- **WalletCard/WalletList**: Wallet connection and management
- **LoadingSpinner**: Reusable loading indicator
- **Toast**: Notification system

### Custom Hooks

- **useVoiceRecording**: Voice recording and streaming logic
- **useMobile**: Mobile device detection and PWA install
- **usePerformance**: Performance monitoring utilities

### API Integration

The `VAPIClient` class in `lib/api-client.ts` handles:

- Voice streaming sessions
- WebSocket connections for real-time communication
- Authentication with access tokens

## 📱 PWA Features

- **Installable**: Can be installed on mobile and desktop
- **Offline Support**: Service worker for caching
- **App-like Experience**: Full-screen, native app feel
- **Push Notifications**: Ready for future implementation

## 🧪 Testing

```bash
# Run type checking
pnpm run type-check

# Run linting
pnpm run lint

# Format code
pnpm run format
```

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure code is properly formatted and typed
5. Submit a pull request

## 📞 Support

For questions or issues, please refer to the project documentation or create an issue in the repository.
