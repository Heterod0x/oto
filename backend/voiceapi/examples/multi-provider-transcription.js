/**
 * Multi-Provider Transcription Service Example
 * 
 * This example demonstrates how to use the abstracted transcription service
 * with different STT providers (AssemblyAI and Google Cloud Speech-to-Text).
 */

const { TranscriptionService, STTProvider } = require('../dist/services/transcription');

async function demonstrateMultiProviderTranscription() {
  console.log('🎤 Multi-Provider Transcription Service Demo\n');

  try {
    // Create transcription service instances for different providers
    console.log('1. Creating transcription service instances...');
    
    // Default provider (from environment configuration)
    const defaultService = new TranscriptionService();
    console.log(`   Default provider: ${defaultService.getCurrentProvider()}`);
    
    // Explicitly use AssemblyAI
    const assemblyService = new TranscriptionService(STTProvider.ASSEMBLYAI);
    console.log(`   AssemblyAI provider: ${assemblyService.getCurrentProvider()}`);
    
    // Explicitly use Google Cloud (if configured)
    try {
      const googleService = new TranscriptionService(STTProvider.GOOGLE_CLOUD);
      console.log(`   Google Cloud provider: ${googleService.getCurrentProvider()}`);
    } catch (error) {
      console.log(`   Google Cloud provider: Not configured (${error.message})`);
    }

    console.log('\n2. Available providers:');
    const availableProviders = defaultService.getAvailableProviders();
    availableProviders.forEach(provider => {
      console.log(`   - ${provider}`);
    });

    console.log('\n3. Setting up event listeners...');
    
    // Set up event listeners
    defaultService.on('connected', (event) => {
      console.log(`   ✅ Connected: ${JSON.stringify(event)}`);
    });

    defaultService.on('disconnected', (event) => {
      console.log(`   ❌ Disconnected: ${JSON.stringify(event)}`);
    });

    defaultService.on('partial-transcript', (event) => {
      console.log(`   🔄 Partial: "${event.text}" (confidence: ${event.confidence})`);
    });

    defaultService.on('final-transcript', (event) => {
      console.log(`   ✅ Final: "${event.text}" (confidence: ${event.confidence})`);
    });

    defaultService.on('error', (error) => {
      console.error(`   ❌ Error: ${error.message}`);
    });

    console.log('\n4. Starting real-time transcription...');
    await defaultService.startRealtimeTranscription();

    // Simulate sending audio data
    console.log('\n5. Simulating audio data...');
    console.log('   (In a real application, you would send actual audio buffers)');
    
    // In a real application, you would send actual audio data like this:
    // const audioBuffer = Buffer.from(audioData);
    // defaultService.sendAudioData(audioBuffer);

    // Wait a bit to simulate transcription
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n6. Stopping transcription...');
    const finalTranscript = await defaultService.stopRealtimeTranscription();
    console.log(`   Final transcript: "${finalTranscript}"`);

    console.log('\n7. Demonstrating provider switching...');
    
    // Get available providers and switch between them
    const providers = defaultService.getAvailableProviders();
    for (const provider of providers) {
      if (provider !== defaultService.getCurrentProvider()) {
        try {
          console.log(`   Switching to ${provider}...`);
          await defaultService.switchProvider(provider);
          console.log(`   ✅ Successfully switched to ${provider}`);
          
          // Switch back to original provider
          await defaultService.switchProvider(providers[0]);
          console.log(`   ✅ Switched back to ${providers[0]}`);
          break;
        } catch (error) {
          console.log(`   ❌ Failed to switch to ${provider}: ${error.message}`);
        }
      }
    }

    console.log('\n8. Demonstrating subtitle conversion...');
    
    // Example transcript with word-level timestamps
    const exampleTranscript = "Hello world, this is a test transcription.";
    const exampleWords = [
      { text: "Hello", start: 0, end: 500 },
      { text: "world,", start: 500, end: 1000 },
      { text: "this", start: 1200, end: 1400 },
      { text: "is", start: 1400, end: 1500 },
      { text: "a", start: 1500, end: 1600 },
      { text: "test", start: 1600, end: 1900 },
      { text: "transcription.", start: 1900, end: 2500 }
    ];

    // Convert to SRT format
    const srtContent = defaultService.convertToSRT(exampleTranscript, exampleWords);
    console.log('   SRT format:');
    console.log(srtContent.split('\n').map(line => `     ${line}`).join('\n'));

    // Convert to VTT format
    const vttContent = defaultService.convertToVTT(exampleTranscript, exampleWords);
    console.log('   VTT format:');
    console.log(vttContent.split('\n').map(line => `     ${line}`).join('\n'));

    console.log('\n✅ Demo completed successfully!');

  } catch (error) {
    console.error('\n❌ Demo failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Configuration examples
function showConfigurationExamples() {
  console.log('\n📋 Configuration Examples:\n');

  console.log('Environment Variables:');
  console.log('```bash');
  console.log('# Choose your STT provider');
  console.log('STT_PROVIDER=assemblyai  # or "google-cloud"');
  console.log('');
  console.log('# AssemblyAI Configuration');
  console.log('ASSEMBLYAI_API_KEY=your_assemblyai_api_key');
  console.log('');
  console.log('# Google Cloud Speech-to-Text Configuration');
  console.log('GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id');
  console.log('GOOGLE_CLOUD_KEY_FILENAME=path/to/service-account-key.json');
  console.log('```\n');

  console.log('Usage in your application:');
  console.log('```javascript');
  console.log('const { transcriptionService, STTProvider } = require("./services/transcription");');
  console.log('');
  console.log('// Use default provider from environment');
  console.log('await transcriptionService.startRealtimeTranscription();');
  console.log('');
  console.log('// Switch providers dynamically');
  console.log('await transcriptionService.switchProvider(STTProvider.GOOGLE_CLOUD);');
  console.log('');
  console.log('// Send audio data');
  console.log('transcriptionService.sendAudioData(audioBuffer);');
  console.log('');
  console.log('// Listen for transcription events');
  console.log('transcriptionService.on("final-transcript", (event) => {');
  console.log('  console.log("Transcription:", event.text);');
  console.log('});');
  console.log('```');
}

// Run the demo
if (require.main === module) {
  showConfigurationExamples();
  demonstrateMultiProviderTranscription().catch(console.error);
}

module.exports = {
  demonstrateMultiProviderTranscription,
  showConfigurationExamples
};
