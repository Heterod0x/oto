import { BaseSTTProvider } from './BaseSTTProvider';
import { AssemblyAIProvider } from './providers/AssemblyAIProvider';
import { GoogleCloudProvider } from './providers/GoogleCloudProvider';
import { STTProvider, STTProviderConfig } from './types';

export class ProviderFactory {
  static createProvider(provider: STTProvider, config: STTProviderConfig): BaseSTTProvider {
    switch (provider) {
      case STTProvider.ASSEMBLYAI:
        return new AssemblyAIProvider(config);
      
      case STTProvider.GOOGLE_CLOUD:
        return new GoogleCloudProvider(config);
      
      default:
        throw new Error(`Unsupported STT provider: ${provider}`);
    }
  }

  static getAvailableProviders(): STTProvider[] {
    return Object.values(STTProvider);
  }

  static validateProviderConfig(provider: STTProvider, config: STTProviderConfig): void {
    switch (provider) {
      case STTProvider.ASSEMBLYAI:
        if (!config.apiKey) {
          throw new Error('AssemblyAI requires an API key');
        }
        break;
      
      case STTProvider.GOOGLE_CLOUD:
        if (!config.projectId && !config.keyFilename) {
          throw new Error('Google Cloud Speech requires either projectId or keyFilename');
        }
        break;
      
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}
