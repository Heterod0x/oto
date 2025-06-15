const fetch = require('node-fetch');

// Test the LLM API with conversation context
async function testLLMAPI() {
  const baseUrl = 'http://localhost:3002';
  
  console.log('Testing Conversation LLM API...\n');

  // Test 1: Health check
  console.log('1. Testing health endpoint...');
  try {
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: Basic chat completion without user_id (should work as normal LLM)
  console.log('\n2. Testing basic chat completion (no conversation context)...');
  try {
    const basicResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Hello, how are you?'
          }
        ],
        model: 'gpt-4o-mini',
        max_tokens: 100
      })
    });

    const basicData = await basicResponse.json();
    console.log('✅ Basic response:', basicData.choices[0].message.content);
  } catch (error) {
    console.log('❌ Basic chat completion failed:', error.message);
  }

  // Test 3: Chat completion with user_id (should search for conversation context)
  console.log('\n3. Testing chat completion with conversation context...');
  try {
    const contextResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'What todos did we discuss in our recent meetings?'
          }
        ],
        model: 'gpt-4o-mini',
        max_tokens: 200,
        user_id: 'test-user-123'
      })
    });

    const contextData = await contextResponse.json();
    console.log('✅ Context-enhanced response:', contextData.choices[0].message.content);
  } catch (error) {
    console.log('❌ Context-enhanced chat completion failed:', error.message);
  }

  // Test 4: Streaming chat completion
  console.log('\n4. Testing streaming chat completion...');
  try {
    const streamResponse = await fetch(`${baseUrl}/chat/completions/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: 'Can you summarize our project discussions?'
          }
        ],
        model: 'gpt-4o-mini',
        max_tokens: 150,
        user_id: 'test-user-123',
        stream: true
      })
    });

    console.log('✅ Streaming response:');
    const reader = streamResponse.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
              process.stdout.write(data.choices[0].delta.content);
            }
          } catch (e) {
            // Ignore parsing errors for streaming chunks
          }
        }
      }
    }
    console.log('\n');
  } catch (error) {
    console.log('❌ Streaming chat completion failed:', error.message);
  }

  console.log('\nTest completed!');
}

// Run the test
if (require.main === module) {
  testLLMAPI().catch(console.error);
}

module.exports = { testLLMAPI };
