import { useState, useEffect, useRef } from 'react';
import { Activity, Mic, MessageSquare } from 'lucide-react';
import { ConfigPanel } from './components/ConfigPanel';
import { AudioRecorder } from './components/AudioRecorder';
import { ActionsList } from './components/ActionsList';
import { ConversationsList } from './components/ConversationsList';
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

  const [activeTab, setActiveTab] = useState<'recorder' | 'actions' | 'conversations'>('recorder');
  const [selectedConversationId, setSelectedConversationId] = useState<string>(uuidv4());
  const [detectedActions, setDetectedActions] = useState<DetectedAction[]>([]);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const transcriptContentRef = useRef<HTMLDivElement>(null);

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
    if (segment.finalized) {
      setTranscriptSegments(prev => [...prev, segment]);
    }
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
      const startTime = formatTimestamp(segment.audioStart);
      const endTime = formatTimestamp(segment.audioEnd);

      let ret = `[${startTime}-${endTime}]`;
      ret += segment.beautified ? '' : '*';
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
          className={`nav-tab ${activeTab === 'recorder' ? 'active' : ''}`}
          onClick={() => setActiveTab('recorder')}
        >
          <Mic size={20} />
          Audio Recorder
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
      </nav>

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
