# VAPI Voice Agent Frontend

AI-powered voice conversation application with task extraction and calendar integration.

## 🚀 Features

### Core Functionality

- **Voice Conversations**: Real-time voice recording and streaming with AI agent
- **Task Extraction**: Automatic extraction and display of tasks from voice conversations
- **Calendar Integration**: Add tasks to Google Calendar and iOS Calendar
- **PWA Support**: Progressive Web App with offline capabilities

### User Interface

- **Modern Design**: Mobile-first responsive design with Tailwind CSS
- **Smooth Animations**: Custom CSS animations and transitions
- **Accessibility**: ARIA labels, keyboard navigation (spacebar for recording)
- **Loading States**: Enhanced loading spinners and progress indicators
- **Toast Notifications**: User-friendly success/error notifications

### Authentication & Navigation

- **Privy Authentication**: Secure wallet-based authentication
- **Bottom Navigation**: Mobile-optimized floating navigation
- **Protected Routes**: Authentication guards for secure pages

## 🛠 Tech Stack

- **Frontend Framework**: Next.js 15.3.3 (Page Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI components
- **Authentication**: Privy
- **PWA**: next-pwa
- **Package Manager**: pnpm
- **Voice API**: VAPI integration (with demo mode)

## 📱 Pages & Components

### Pages

1. **Authentication** (`/`) - Login with Privy
2. **Agent Chat** (`/agent`) - Voice conversation interface
3. **Tasks** (`/tasks`) - Task management and calendar integration

### Key Components

- **AgentChat**: Voice recording interface with WebSocket streaming
- **TaskList**: Real-time task display with calendar integration
- **FooterNavigation**: Mobile-optimized navigation
- **LoadingSpinner**: Reusable loading component
- **PWAInstallPrompt**: App installation prompt

## 🎯 User Flow

1. **Authentication**: User logs in with wallet via Privy
2. **Voice Recording**: User starts voice conversation with agent
3. **Real-time Processing**: Audio streams to VAPI for AI processing
4. **Task Extraction**: AI extracts actionable tasks from conversation
5. **Task Management**: User reviews and adds tasks to calendar
6. **Calendar Integration**: Tasks synced with Google/iOS calendars

## 🔧 Development Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Export static files
pnpm run export
```

## 🌐 Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_VAPI_TOKEN=your_vapi_token
NEXT_PUBLIC_VAPI_ENDPOINT=wss://api.vapi.ai
```

## 📦 Key Dependencies

```json
{
  "next": "^15.3.3",
  "react": "^18.2.0",
  "typescript": "^5.0.0",
  "@privy-io/react-auth": "latest",
  "next-pwa": "latest",
  "tailwindcss": "latest",
  "lucide-react": "latest",
  "@radix-ui/react-slot": "latest"
}
```

## 🎨 Design System

### Colors

- **Primary**: Violet/Purple (`#7c3aed`)
- **Secondary**: Blue (`#3b82f6`)
- **Success**: Green (`#10b981`)
- **Error**: Red (`#ef4444`)

### Typography

- **Fonts**: System fonts with fallbacks
- **Sizes**: Responsive typography scale

### Animations

- **Fade In**: Smooth element appearances
- **Slide Up**: Bottom-to-top transitions
- **Pulse**: Recording indicator
- **Spin**: Loading spinners

## 📱 PWA Configuration

### Manifest Features

- **Standalone App**: Full-screen experience
- **App Shortcuts**: Quick access to chat and tasks
- **Share Target**: Accept shared content
- **Japanese Localization**: `ja-JP` locale support

### Service Worker

- **Caching Strategy**: Network-first with fallback
- **Offline Support**: Basic offline functionality
- **Background Sync**: Queue actions when offline

## 🔒 Security & Privacy

- **Authentication**: Secure wallet-based login
- **Route Protection**: Private routes require authentication
- **Data Handling**: Minimal data collection
- **Voice Processing**: Secure streaming to VAPI

## 🚀 Deployment

### Static Export

```bash
pnpm run build
pnpm run export
```

### Vercel Deploy

```bash
vercel --prod
```

### PWA Installation

- Browser install prompt
- Custom install UI component
- Mobile add-to-homescreen

## 🧪 Demo Mode

The application includes demo mode for testing without VAPI backend:

- **Voice Recording**: Simulated recording states
- **Task Data**: Predefined demo tasks
- **Calendar Actions**: Mock integration responses
- **Offline Testing**: Full UI testing without backend

## 🔄 State Management

- **React Hooks**: useState, useEffect for local state
- **Custom Hooks**:
  - `useVoiceRecording`: Audio recording management
  - `useIsMobile`: Responsive breakpoint detection
  - `usePWAInstall`: PWA installation handling

## 📊 Performance

- **Bundle Size**: Optimized with tree shaking
- **Loading**: Progressive loading states
- **Caching**: Aggressive caching strategy
- **Mobile**: 60fps animations on mobile devices

## 🐛 Known Issues

- **Punycode Warning**: Deprecated module in dependencies (non-breaking)
- **Webpack Cache**: Occasional cache write failures (non-breaking)
- **Experimental APIs**: Battery/Connection APIs in dev mode only

## 🚀 Future Enhancements

1. **Real VAPI Integration**: Replace demo mode with actual API
2. **Calendar APIs**: Implement real calendar integrations
3. **Push Notifications**: Task reminders and updates
4. **Voice Synthesis**: AI agent voice responses
5. **Multi-language**: Expand beyond Japanese
6. **Team Features**: Shared task workspaces
7. **Analytics**: Usage tracking and insights

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

For issues and questions:

- GitHub Issues
- Development Discord
- Email support

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
