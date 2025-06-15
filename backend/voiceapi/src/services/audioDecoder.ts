import { EventEmitter } from 'node:events';
import prism from 'prism-media';
import fs from 'node:fs';
import wav from 'wav';

export class AudioDecoder extends EventEmitter {
  private input = new prism.opus.WebmDemuxer();
  private decoder = new prism.opus.Decoder({
    frameSize: 1600,
    channels: 1,
    rate: 16_000,
  });

  private wavWriter = new wav.Writer({
    sampleRate: 16_000,
    channels: 1,
    bitDepth: 16,
  });

  constructor(writeToWav: boolean = false, outputPath = 'output.wav') {
    super();

    if (writeToWav) {
      this.wavWriter.pipe(fs.createWriteStream(outputPath));
    }

    this.input.pipe(this.decoder).on('data', (pcm: Buffer) => {
      if (writeToWav) {
        this.wavWriter.write(pcm);
      }
      this.emit('pcm', pcm);
    });

    if (writeToWav) {
      this.decoder.on('end', () => this.wavWriter.end());
    }
  }

  write(chunk: Buffer) { this.input.write(chunk); }
  end()             { this.input.end();  }
}
