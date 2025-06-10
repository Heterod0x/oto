import OpenAI from 'openai';
import { config } from '../config';

export interface BeautifiedSegment {
  beautifiedText: string;
  startTimestamp: string;
  endTimestamp: string;
  speaker: string;
}

export interface BeautificationResult {
  segments: BeautifiedSegment[];
  totalOriginalLength: number;
  totalBeautifiedLength: number;
}

export class TranscriptionBeautifier {
  private openai: OpenAI;
  private model: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    this.model = "gpt-4o-mini";
  }

  /**
   * Beautify multiple transcript segments as a batch
   */
  async beautifyTranscriptBatch(
    segments: Array<{
      text: string;
      startTimestamp: string;
      endTimestamp: string;
    }>
  ): Promise<BeautificationResult> {
    try {
      const prompt = this.buildBeautificationPrompt();
      
      const input = segments
        .map(segment => `[${segment.startTimestamp} - ${segment.endTimestamp}] ${segment.text}`)
        .join('\n');

      console.log("input", input);
      
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: input,
          },
        ],
        temperature: 0.3,
        max_tokens: 3000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return this.createFallbackBatchResult(segments);
      }

      return this.parseBeautificationBatchResponse(content, segments);
    } catch (error) {
      console.error('Failed to beautify transcript batch:', error);
      return this.createFallbackBatchResult(segments);
    }
  }

  private buildBeautificationPrompt(): string {
    /*
    return `入力された音声認識テキストを綺麗に会話になるよう整頓してください。ある程度の想像を含む修正も実施し、話者も可能な範囲で識別しましょう。会話のスタイルは維持しましょう。自由にくっつけたり、離したりすることもあります。
返すフォーマットは以下の通りです:
[00:00:00 - 00:00:05] Speaker A
body

[00:00:05 - 00:00:10] Speaker B
body

...
`;*/
return `入力された音声認識テキストを綺麗に会話になるよう整頓してください。ある程度の想像を含む修正も実施しましょう。会話のスタイルは維持しましょう。
自由にくっつけたり、離したりすることもあります。言語は元の言語を維持しましょう。

返すフォーマットは以下の通りです:
[00:00:00 - 00:00:05]
body

[00:00:05 - 00:00:10]
body

...
`;
  }


  private parseBeautificationBatchResponse(
    response: string,
    originalSegments: Array<{
      text: string;
      startTimestamp: string;
      endTimestamp: string;
    }>
  ): BeautificationResult {
    try {
        const lines = response.split('\n');
        const segments: BeautifiedSegment[] = [];

        for (const line of lines) {
            if (line.includes(']')) {
                let [timestamp, text] = line.split(']');
                timestamp = timestamp.replace('[', '').trim();
                //speaker = speaker.replace(':', '');
                segments.push({
                    beautifiedText: text.trim(),
                    startTimestamp: timestamp.split(' - ')[0].trim(),
                    endTimestamp: timestamp.split(' - ')[1].trim(),
                    //speaker: speaker.trim(),
                    speaker: 'Unknown',
                });
            }else {
                // append
                segments[segments.length - 1].beautifiedText += line + '\n';
            }
        }

        // trim segments
        segments.forEach(segment => {
            segment.beautifiedText = segment.beautifiedText.trim();
        });

        const totalOriginalLength = originalSegments.reduce((sum, seg) => sum + seg.text.length, 0);
        const totalBeautifiedLength = segments.reduce((sum, seg) => sum + seg.beautifiedText.length, 0);

        return {
          segments,
          totalOriginalLength,
          totalBeautifiedLength,
        };
    } catch (error) {
      console.error('Failed to parse beautification batch response:', error);
      return this.createFallbackBatchResult(originalSegments);
    }
  }

  private createFallbackResult(
    originalText: string,
    startTimestamp: string,
    endTimestamp: string
  ): BeautificationResult {
    return {
      segments: [
        {
          beautifiedText: originalText,
          startTimestamp,
          endTimestamp,
          speaker: "Unknown",
        },
      ],
      totalOriginalLength: originalText.length,
      totalBeautifiedLength: originalText.length,
    };
  }

  private createFallbackBatchResult(
    originalSegments: Array<{
      text: string;
      startTimestamp: string;
      endTimestamp: string;
    }>
  ): BeautificationResult {
    const segments: BeautifiedSegment[] = originalSegments.map(segment => ({
      beautifiedText: segment.text,
      startTimestamp: segment.startTimestamp,
      endTimestamp: segment.endTimestamp,
      speaker: "Unknown",
    }));

    const totalOriginalLength = originalSegments.reduce((sum, seg) => sum + seg.text.length, 0);

    return {
      segments,
      totalOriginalLength,
      totalBeautifiedLength: totalOriginalLength,
    };
  }
}

export const transcriptionBeautifier = new TranscriptionBeautifier();
