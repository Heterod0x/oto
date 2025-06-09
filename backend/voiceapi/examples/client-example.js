/**
 * Example client for Oto Voice API
 * This demonstrates how to connect to the WebSocket and interact with the REST API
 */

const WebSocket = require('ws');
const fetch = require('node-fetch'); // You may need to install: npm install node-fetch

// Configuration
const API_BASE_URL = 'http://localhost:3000';
const WS_BASE_URL = 'ws://localhost:3000';
const API_KEY = 'your-api-key-here';
const USER_ID = 'your-user-id-here';
const CONVERSATION_ID = 'your-conversation-id-here'; // Create this in your database first

// Headers for authentication
const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'OTO_USER_ID': USER_ID,
  'Content-Type': 'application/json'
};

class OtoVoiceClient {
  constructor() {
    this.ws = null;
    this.isConnected = false;
  }

  // Connect to WebSocket for audio streaming
  async connectAudioStream(conversationId) {
    const wsUrl = `${WS_BASE_URL}/conversation/${conversationId}/stream`;
    
    this.ws = new WebSocket(wsUrl, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'OTO_USER_ID': USER_ID
      }
    });

    this.ws.on('open', () => {
      console.log('✅ Connected to audio stream');
      this.isConnected = true;
    });

    this.ws.on('message', (data) => {
      const message = JSON.parse(data.toString());
      this.handleWebSocketMessage(message);
    });

    this.ws.on('close', (code, reason) => {
      console.log(`❌ WebSocket closed: ${code} ${reason}`);
      this.isConnected = false;
    });

    this.ws.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
    });

    // Wait for connection
    return new Promise((resolve, reject) => {
      this.ws.on('open', resolve);
      this.ws.on('error', reject);
    });
  }

  // Handle incoming WebSocket messages
  handleWebSocketMessage(message) {
    switch (message.type) {
      case 'transcribe':
        const status = message.data.finalized ? '✅ Final' : '⏳ Partial';
        console.log(`${status} Transcript: "${message.data.transcript}"`);
        break;
      
      case 'detect-action':
        console.log('🎯 Action detected:', {
          type: message.data.type,
          title: message.data.inner.title,
          id: message.data.id
        });
        break;
      
      case 'error':
        console.error('❌ WebSocket error:', message.message);
        break;
      
      default:
        console.log('📨 Unknown message type:', message.type);
    }
  }

  // Send audio data (base64 encoded)
  sendAudio(base64AudioData) {
    if (!this.isConnected || !this.ws) {
      console.error('❌ WebSocket not connected');
      return;
    }

    this.ws.send(JSON.stringify({
      type: 'audio',
      data: base64AudioData
    }));
  }

  // Complete the conversation
  completeConversation() {
    if (!this.isConnected || !this.ws) {
      console.error('❌ WebSocket not connected');
      return;
    }

    console.log('🏁 Completing conversation...');
    this.ws.send(JSON.stringify({
      type: 'complete'
    }));
  }

  // REST API Methods

  // List all actions
  async listActions(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const url = `${API_BASE_URL}/actions?${queryParams}`;
    
    try {
      const response = await fetch(url, { headers });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to list actions');
      }
      
      return data.actions;
    } catch (error) {
      console.error('❌ Error listing actions:', error);
      throw error;
    }
  }

  // Get specific action
  async getAction(actionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/action/${actionId}`, { headers });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get action');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error getting action:', error);
      throw error;
    }
  }

  // Update action status
  async updateAction(actionId, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/action/${actionId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update action');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error updating action:', error);
      throw error;
    }
  }

  // List conversations
  async listConversations(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const url = `${API_BASE_URL}/conversations?${queryParams}`;
    
    try {
      const response = await fetch(url, { headers });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to list conversations');
      }
      
      return data.conversations;
    } catch (error) {
      console.error('❌ Error listing conversations:', error);
      throw error;
    }
  }

  // Get conversation transcript
  async getTranscript(conversationId, format = 'plain') {
    try {
      const response = await fetch(
        `${API_BASE_URL}/conversation/${conversationId}/transcript?format=${format}`,
        { headers }
      );
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get transcript');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error getting transcript:', error);
      throw error;
    }
  }

  // Get conversation logs
  async getConversationLogs(conversationId, options = {}) {
    const queryParams = new URLSearchParams(options);
    const url = `${API_BASE_URL}/conversation/${conversationId}/logs?${queryParams}`;
    
    try {
      const response = await fetch(url, { headers });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get conversation logs');
      }
      
      return data.logs;
    } catch (error) {
      console.error('❌ Error getting conversation logs:', error);
      throw error;
    }
  }

  // Close WebSocket connection
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.isConnected = false;
    }
  }
}

// Example usage
async function example() {
  const client = new OtoVoiceClient();

  try {
    // 1. Connect to audio stream
    console.log('🔌 Connecting to audio stream...');
    await client.connectAudioStream(CONVERSATION_ID);

    // 2. Simulate sending audio data
    console.log('🎤 Simulating audio data...');
    // In a real application, you would capture audio from microphone
    // and convert it to base64
    const fakeAudioData = Buffer.from('fake audio data').toString('base64');
    client.sendAudio(fakeAudioData);

    // 3. Wait a bit, then complete conversation
    setTimeout(() => {
      client.completeConversation();
    }, 5000);

    // 4. List actions after a delay
    setTimeout(async () => {
      console.log('📋 Listing actions...');
      const actions = await client.listActions();
      console.log(`Found ${actions.length} actions`);
      
      // Update first action if exists
      if (actions.length > 0) {
        console.log('✏️ Updating first action...');
        await client.updateAction(actions[0].id, 'accepted');
        console.log('✅ Action updated');
      }

      // Get conversation transcript
      console.log('📄 Getting transcript...');
      const transcript = await client.getTranscript(CONVERSATION_ID);
      console.log('Transcript:', transcript.transcript);

      // Disconnect
      client.disconnect();
    }, 7000);

  } catch (error) {
    console.error('❌ Example failed:', error);
    client.disconnect();
  }
}

// Run example if this file is executed directly
if (require.main === module) {
  console.log('🚀 Starting Oto Voice API client example...');
  console.log('⚠️  Make sure to update the configuration variables at the top of this file');
  console.log('⚠️  Make sure the server is running on localhost:3000');
  console.log('⚠️  Make sure you have a conversation created in your database\n');
  
  example().catch(console.error);
}

module.exports = OtoVoiceClient;
