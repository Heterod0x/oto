import { useState, useEffect, useRef } from 'react';
import { Activity, Mic, MessageSquare, Bot } from 'lucide-react';
import { ConfigPanel } from './components/ConfigPanel';
import { AudioRecorder } from './components/AudioRecorder';
import { ActionsList } from './components/ActionsList';
import { ConversationsList } from './components/ConversationsList';
import { AgentChat } from './components/AgentChat';
import { ApiService } from './services/api';
import { WebSocketService } from './services/websocket';
import { ApiConfig, DetectedAction, TranscriptSegment, TranscriptBeautifyData } from './types';
import { getApiConfig } from './config/env';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [config, setConfig] = useState<ApiConfig>(getApiConfig());

  const [apiService, setApiService] = useState<ApiService>(new ApiService(config));
  const [wsService, setWsService] = useState<WebSocketService>(
    new WebSocketService(config.baseUrl, config.authToken, config.userId)
  );

  const [activeTab, setActiveTab] = useState<'recorder' | 'actions' | 'conversations' | 'agent'>('recorder');
  const [selectedConversationId, setSelectedConversationId] = useState<string>(uuidv4());
  const [detectedActions, setDetectedActions] = useState<DetectedAction[]>([]);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const transcriptContentRef = useRef<HTMLDivElement>(null);

  // Recording state lifted to App level to persist across tab switches
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isStoppingRecording, setIsStoppingRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>('Disconnected');
  const [inputMode, setInputMode] = useState<'microphone' | 'file'>('microphone');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isFileLoaded, setIsFileLoaded] = useState(false);
  const [fileDuration, setFileDuration] = useState(0);
  const [currentFileTime, setCurrentFileTime] = useState(0);

  const handleConfigChange = (newConfig: ApiConfig) => {
    setConfig(newConfig);
    const newApiService = new ApiService(newConfig);
    const newWsService = new WebSocketService(newConfig.baseUrl, newConfig.authToken, newConfig.userId);
    setApiService(newApiService);
    setWsService(newWsService);
  };

  const handleError = (error: string) => {
    setErrors(prev => [...prev, `${new Date().toLocaleTimeString()}: ${error}`]);
  };

  const handleTranscriptSegment = (segment: TranscriptSegment) => {
    setTranscriptSegments(prev => {
      if (segment.finalized) {
        // For finalized segments, remove any existing partial transcript and add the finalized one
        const filteredSegments = prev.filter(s => s.finalized); // Remove partial transcripts
        return [...filteredSegments, { ...segment, id: `${segment.audioStart}-${segment.audioEnd}` }];
      } else {
        // For partial segments, replace any existing partial transcript
        const finalizedSegments = prev.filter(s => s.finalized); // Keep only finalized segments
        return [...finalizedSegments, { ...segment, id: 'partial-current', audioStart: 999999999, audioEnd: 999999999 }]; // Add current partial
      }
    });
  };

  const handleTranscriptBeautify = (beautifyData: TranscriptBeautifyData) => {
    setTranscriptSegments(prev => {
      // Filter out segments that fall within the beautified range
      const filteredSegments = prev.filter(segment => 
        segment.audioEnd <= beautifyData.audioStart || segment.audioStart >= beautifyData.audioEnd
      );
      
      // Add the beautified segment
      /*
      const beautifiedSegment: TranscriptSegment = {
        audioStart: beautifyData.audioStart,
        audioEnd: beautifyData.audioEnd,
        transcript: beautifyData.transcript,
        finalized: true
      };*/
      const beautifiedSegments = beautifyData.segments.map(segment => ({
        audioStart: segment.audioStart,
        audioEnd: segment.audioEnd,
        transcript: segment.transcript,
        finalized: true,
        beautified: true,
      }));
      
      // Insert in chronological order
      const newSegments = [...filteredSegments, ...beautifiedSegments];
      return newSegments.sort((a, b) => a.audioStart - b.audioStart);
    });
  };

  // Helper function to format milliseconds to HH:MM:SS
  const formatTimestamp = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Generate formatted transcript from segments
  const formattedTranscript = transcriptSegments
    .sort((a, b) => a.audioStart - b.audioStart)
    .map(segment => {
      let ret = '';
      
      // For partial transcripts, don't show timing (might not be meaningful)
      if (segment.finalized) {
        const startTime = formatTimestamp(segment.audioStart);
        const endTime = formatTimestamp(segment.audioEnd);
        ret = `[${startTime}-${endTime}]`;
      } else {
        ret = '[Live]'; // Show "Live" for partial transcripts
      }
      
      // Add status indicators
      if (segment.beautified) {
        ret += ' ✓'; // Beautified
      } else if (segment.finalized) {
        ret += ' *'; // Finalized but not beautified
      } else {
        ret += ' ~'; // Partial/interim transcript
      }
      
      ret += `\n${segment.transcript}`;

      return ret;
    })
    .join('\n\n');

  const handleActionDetected = (action: DetectedAction) => {
    setDetectedActions(prev => [action, ...prev.slice(0, 9)]); // Keep last 10 actions
  };

  const checkHealth = async () => {
    try {
      const health = await apiService.getHealth();
      setHealthStatus(health);
    } catch (error) {
      handleError(`Health check failed: ${error}`);
    }
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const clearTranscriptSegments = () => {
    setTranscriptSegments([]);
  };

  useEffect(() => {
    checkHealth();
  }, [apiService]);

  // Auto-scroll to bottom when transcript is updated
  useEffect(() => {
    if (transcriptContentRef.current && transcriptSegments.length > 0) {
      transcriptContentRef.current.scrollTop = transcriptContentRef.current.scrollHeight;
    }
  }, [transcriptSegments]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>
            <Activity size={32} />
            Oto Voice API Playground
          </h1>
          <div className="header-controls">
            <ConfigPanel config={config} onConfigChange={handleConfigChange} />
            {healthStatus && (
              <div className="health-status">
                <span className="status-indicator healthy"></span>
                Server: {healthStatus.status}
                <small>({healthStatus.activeWebSocketSessions} active sessions)</small>
              </div>
            )}
          </div>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-tab ${activeTab === 'recorder' ? 'active' : ''} ${isRecording ? 'recording' : ''}`}
          onClick={() => setActiveTab('recorder')}
        >
          <Mic size={20} />
          Audio Recorder
          {isRecording && <span className="recording-indicator-dot"></span>}
        </button>
        <button
          className={`nav-tab ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          <Activity size={20} />
          Actions
        </button>
        <button
          className={`nav-tab ${activeTab === 'conversations' ? 'active' : ''}`}
          onClick={() => setActiveTab('conversations')}
        >
          <MessageSquare size={20} />
          Conversations
        </button>
        <button
          className={`nav-tab ${activeTab === 'agent' ? 'active' : ''}`}
          onClick={() => setActiveTab('agent')}
        >
          <Bot size={20} />
          Talk with Agent
        </button>
      </nav>

      {/* Recording status banner when not on recorder tab */}
      {isRecording && activeTab !== 'recorder' && (
        <div className="recording-status-banner">
          <div className="recording-status-content">
            <div className="recording-status-indicator">
              <div className="pulse"></div>
              <span>Recording in progress...</span>
            </div>
            <div className="recording-status-info">
              <span>Mode: {inputMode === 'microphone' ? 'Microphone' : 'Audio File'}</span>
              {inputMode === 'file' && selectedFile && (
                <span>File: {selectedFile.name}</span>
              )}
            </div>
            <button 
              className="btn-secondary"
              onClick={() => setActiveTab('recorder')}
            >
              Go to Recorder
            </button>
          </div>
        </div>
      )}

      <main className="app-main">
        {activeTab === 'recorder' && (
          <div className="recorder-tab">
            <div className="recorder-section">
              <AudioRecorder
                wsService={wsService}
                conversationId={selectedConversationId}
                onTranscriptSegment={handleTranscriptSegment}
                onTranscriptBeautify={handleTranscriptBeautify}
                onActionDetected={handleActionDetected}
                onError={handleError}
                isConnected={isConnected}
                setIsConnected={setIsConnected}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
                isStoppingRecording={isStoppingRecording}
                setIsStoppingRecording={setIsStoppingRecording}
                connectionStatus={connectionStatus}
                setConnectionStatus={setConnectionStatus}
                inputMode={inputMode}
                setInputMode={setInputMode}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                isFileLoaded={isFileLoaded}
                setIsFileLoaded={setIsFileLoaded}
                fileDuration={fileDuration}
                setFileDuration={setFileDuration}
                currentFileTime={currentFileTime}
                setCurrentFileTime={setCurrentFileTime}
              />
              
              <div className="conversation-input">
                <label htmlFor="conversationId">Conversation ID:</label>
                <input
                  id="conversationId"
                  type="text"
                  value={selectedConversationId}
                  onChange={(e) => setSelectedConversationId(e.target.value)}
                  placeholder="Enter conversation ID"
                />
              </div>
            </div>

            <div className="transcript-section">
              <div className="transcript-header">
                <h3>Live Transcript</h3>
                <div className="transcript-legend">
                  <small>
                    <span>~ Partial</span> | <span>* Finalized</span> | <span>✓ Beautified</span>
                  </small>
                </div>
                {transcriptSegments.length > 0 && (
                  <button onClick={clearTranscriptSegments} className="btn-clear">
                    Clear Transcript
                  </button>
                )}
              </div>
              <div className="transcript-content" ref={transcriptContentRef}>
                <pre>{formattedTranscript || 'No transcript yet...'}</pre>
              </div>
            </div>

            {/*detectedActions.length > 0*/ true && (
              <div className="live-actions">
                <h3>Recently Detected Actions</h3>
                {detectedActions.length == 0 && (
                  <div className="actions-preview">
                    <span className="action-preview">No actions detected yet...</span>
                  </div>
                )}
                <div className="actions-preview">
                  {detectedActions.slice(0, 99).map((action, index) => (
                    <div key={index} className="action-preview">
                      <span className="action-type">{action.type}</span>
                      <span className="action-title">{action.inner.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <ActionsList
            conversationId={selectedConversationId}
            apiService={apiService}
            detectedActions={detectedActions}
            onError={handleError}
          />
        )}

        {activeTab === 'conversations' && (
          <ConversationsList
            apiService={apiService}
            onConversationSelect={setSelectedConversationId}
            selectedConversationId={selectedConversationId}
            onError={handleError}
          />
        )}

        {activeTab === 'agent' && (
          <AgentChat
            config={config}
            onError={handleError}
          />
        )}
      </main>

      {errors.length > 0 && (
        <div className="error-panel">
          <div className="error-header">
            <h4>Errors ({errors.length})</h4>
            <button onClick={clearErrors} className="btn-clear">
              Clear
            </button>
          </div>
          <div className="error-list">
            {errors.slice(-5).map((error, index) => (
              <div key={index} className="error-item">
                {error}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
