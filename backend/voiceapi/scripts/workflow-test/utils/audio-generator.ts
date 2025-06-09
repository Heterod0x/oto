import { DEFAULT_CONFIG } from '../config';

export class AudioGenerator {
  static generateMockAudioData(): Buffer[] {
    const chunks: Buffer[] = [];
    const { CHUNK_SIZE, TOTAL_CHUNKS, AUDIO_FREQUENCY, SAMPLE_RATE } = DEFAULT_CONFIG;

    for (let i = 0; i < TOTAL_CHUNKS; i++) {
      const chunk = Buffer.alloc(CHUNK_SIZE);
      
      for (let j = 0; j < CHUNK_SIZE; j += 2) { // 2 bytes per sample (16-bit)
        // Generate sine wave pattern for realistic audio simulation
        const sampleIndex = i * CHUNK_SIZE + j;
        const sample = Math.sin(2 * Math.PI * AUDIO_FREQUENCY * sampleIndex / SAMPLE_RATE) * 32767;
        
        // Write 16-bit little-endian sample
        if (j + 1 < CHUNK_SIZE) {
          chunk.writeInt16LE(Math.floor(sample), j);
        }
      }
      
      chunks.push(chunk);
    }

    return chunks;
  }

  static getTotalDataSize(): number {
    return DEFAULT_CONFIG.CHUNK_SIZE * DEFAULT_CONFIG.TOTAL_CHUNKS;
  }

  static getEstimatedDuration(): number {
    // Estimate duration based on sample rate and data size
    const totalSamples = this.getTotalDataSize() / 2; // 16-bit samples
    return (totalSamples / DEFAULT_CONFIG.SAMPLE_RATE) * 1000; // in milliseconds
  }
}
