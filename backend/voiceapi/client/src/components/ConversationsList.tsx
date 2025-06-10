import React, { useState, useEffect } from 'react';
import { MessageSquare, Download, FileText, Clock } from 'lucide-react';
import { Conversation, ConversationLog } from '../types';
import { ApiService } from '../services/api';

interface ConversationsListProps {
  apiService: ApiService;
  onConversationSelect: (conversationId: string) => void;
  selectedConversationId?: string;
  onError: (error: string) => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  apiService,
  onConversationSelect,
  selectedConversationId,
  onError
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [logs, setLogs] = useState<ConversationLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState<string>('');
  const [transcriptFormat, setTranscriptFormat] = useState<'plain' | 'srt' | 'vtt'>('plain');

  const loadConversations = async () => {
    setLoading(true);
    try {
      const conversationsList = await apiService.listConversations();
      setConversations(conversationsList);
    } catch (error) {
      onError(`Failed to load conversations: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const loadConversationLogs = async (conversationId: string) => {
    try {
      const conversationLogs = await apiService.getConversationLogs(conversationId);
      setLogs(conversationLogs);
    } catch (error) {
      onError(`Failed to load conversation logs: ${error}`);
    }
  };

  const loadTranscript = async (conversationId: string) => {
    try {
      const transcript = await apiService.getConversationTranscript(conversationId, transcriptFormat);
      setSelectedTranscript(transcript.transcript);
    } catch (error) {
      onError(`Failed to load transcript: ${error}`);
    }
  };

  const downloadAudio = async (conversationId: string) => {
    try {
      const audioData = await apiService.getConversationAudioUrl(conversationId);
      if (audioData.audio_url) {
        window.open(audioData.audio_url, '_blank');
      } else {
        onError('Audio URL not available');
      }
    } catch (error) {
      onError(`Failed to get audio URL: ${error}`);
    }
  };

  const msToTime = (ms: number) => {
    const hours   = Math.floor(ms / 3_600_000);          // 1000*60*60
    const minutes = Math.floor(ms / 60_000) % 60;        // 残り分
    const seconds = Math.floor(ms / 1000) % 60;          // 残り秒

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      loadConversationLogs(selectedConversationId);
      loadTranscript(selectedConversationId);
    }
  }, [selectedConversationId, transcriptFormat]);

  return (
    <div className="conversations-list">
      <div className="conversations-header">
        <h3>Conversations</h3>
        <button onClick={loadConversations} className="btn-secondary" disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="conversations-grid">
        <div className="conversations-panel">
          <h4>All Conversations ({conversations.length})</h4>
          {conversations.length === 0 ? (
            <p className="no-conversations">No conversations found</p>
          ) : (
            <div className="conversation-items">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${selectedConversationId === conversation.id ? 'selected' : ''}`}
                  onClick={() => onConversationSelect(conversation.id)}
                >
                  <div className="conversation-header">
                    <MessageSquare size={16} />
                    <span className="conversation-id">{conversation.id}</span>
                    <div className={`conversation-status ${conversation.status}`}>
                      {conversation.status}
                    </div>
                  </div>
                  <div className="conversation-content">
                    {conversation.title && <h5>{conversation.title}</h5>}
                    {conversation.last_transcript_preview && (
                      <p className="transcript-preview">
                        {conversation.last_transcript_preview}
                      </p>
                    )}
                    <div className="conversation-meta">
                      <small>Created: {new Date(conversation.created_at).toLocaleString()}</small>
                      <small>Updated: {new Date(conversation.updated_at).toLocaleString()}</small>
                    </div>
                  </div>
                  <div className="conversation-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadAudio(conversation.id);
                      }}
                      className="btn-icon"
                      title="Download Audio"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedConversationId && (
          <div className="conversation-details">
            <div className="details-header">
              <h4>Conversation Details</h4>
              <div className="format-selector">
                <label>Transcript Format:</label>
                <select
                  value={transcriptFormat}
                  onChange={(e) => setTranscriptFormat(e.target.value as 'plain' | 'srt' | 'vtt')}
                >
                  <option value="plain">Plain Text</option>
                  <option value="srt">SRT</option>
                  <option value="vtt">VTT</option>
                </select>
              </div>
            </div>

            <div className="details-content">
              <div className="transcript-section">
                <h5>
                  <FileText size={16} />
                  Full Transcript
                </h5>
                <div className="transcript-content">
                  {selectedTranscript ? (
                    <pre>{selectedTranscript}</pre>
                  ) : (
                    <p>No transcript available</p>
                  )}
                </div>
              </div>

              <div className="logs-section">
                <h5>
                  <Clock size={16} />
                  Conversation Logs ({logs.length})
                </h5>
                <div className="logs-content">
                  {logs.length === 0 ? (
                    <p>No logs available</p>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="log-item">
                        <div className="log-header">
                          <span className={`speaker ${log.speaker}`}>{log.speaker}</span>
                          <span className="time-range">
                            {msToTime(log.start)} - {msToTime(log.end)}
                          </span>
                        </div>
                        <div className="log-content">
                          <p className="summary">{log.summary}</p>
                          {log.transcript_excerpt && (
                            <p className="transcript-excerpt">
                              "{log.transcript_excerpt}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
