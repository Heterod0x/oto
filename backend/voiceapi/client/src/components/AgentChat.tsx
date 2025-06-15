import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RefreshCcw } from 'lucide-react';
import { ChatService } from '../services/chat';
import { ChatMessage, ApiConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AgentChatProps {
  config: ApiConfig;
  onError: (error: string) => void;
}

export function AgentChat({ config, onError }: AgentChatProps) {
  const [chatService] = useState(() => new ChatService(config));
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Check LLM API health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  // Update chat service when config changes
  useEffect(() => {
    chatService.updateConfig(config);
    checkHealth();
  }, [config, chatService]);

  const checkHealth = async () => {
    try {
      const health = await chatService.checkHealth();
      setHealthStatus(health);
    } catch (error) {
      setHealthStatus(null);
      onError(`LLM API health check failed: ${error}`);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      id: uuidv4(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsStreaming(true);
    setStreamingContent('');

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    let accumulatedContent = '';

    try {
      await chatService.sendMessageStream(
        newMessages,
        (content: string) => {
          accumulatedContent += content;
          setStreamingContent(accumulatedContent);
        },
        () => {
          // On complete
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: accumulatedContent,
            timestamp: new Date().toISOString(),
            id: uuidv4(),
          };
          setMessages(prev => [...prev, assistantMessage]);
          setStreamingContent('');
          setIsStreaming(false);
        },
        (error: string) => {
          // On error
          onError(`Chat error: ${error}`);
          setIsStreaming(false);
          setStreamingContent('');
        }
      );
    } catch (error) {
      onError(`Failed to send message: ${error}`);
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const clearChat = () => {
    setMessages([]);
    setStreamingContent('');
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  };

  const handleRetryMessage = () => {
    const latestMessage = messages[messages.length - 2];
    setMessages(messages.slice(0, -2));
    setInputMessage(latestMessage.content);
    setIsStreaming(false);
    setStreamingContent('');
  };

  return (
    <div className="agent-chat">
      <div className="chat-header">
        <div className="chat-title">
          <Bot size={24} />
          <h2>Talk with Agent</h2>
        </div>
        <div className="chat-controls">
          {healthStatus && (
            <div className="health-status">
              <span className="status-indicator healthy"></span>
              LLM API: {healthStatus.status}
            </div>
          )}
          {messages.length > 0 && (
            <button onClick={clearChat} className="btn-clear">
              Clear Chat
            </button>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && !isStreaming && (
          <div className="chat-welcome">
            <Bot size={48} />
            <h3>Welcome to Agent Chat</h3>
            <p>Ask me anything about your conversations, todos, or any questions you have!</p>
            <div className="chat-suggestions">
              <button 
                className="suggestion-chip"
                onClick={() => setInputMessage("What conversations did I have today?")}
              >
                What conversations did I have today?
              </button>
              <button 
                className="suggestion-chip"
                onClick={() => setInputMessage("Show me my recent todos")}
              >
                Show me my recent todos
              </button>
              <button 
                className="suggestion-chip"
                onClick={() => setInputMessage("Summarize my last meeting")}
              >
                Summarize my last meeting
              </button>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className="message-content">
              <div className="message-text">{message.content}</div>
              <div className="message-timestamp">
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}

        {isStreaming && (
          <div className="message assistant streaming">
            <div className="message-avatar">
              <Bot size={20} />
            </div>
            <div className="message-content">
              <div className="message-text">
                {streamingContent}
                <span className="cursor">|</span>
              </div>
              <div className="message-timestamp">
                <Loader2 size={12} className="spinning" />
                Thinking...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your conversations..."
            disabled={isStreaming}
            rows={1}
          />
          <button
            onClick={handleRetryMessage}
            disabled={isStreaming}
            className="send-button"
          >
            <RefreshCcw size={20} />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isStreaming}
            className="send-button"
          >
            {isStreaming ? (
              <Loader2 size={20} className="spinning" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
