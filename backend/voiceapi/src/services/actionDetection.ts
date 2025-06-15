import OpenAI from 'openai';
import { config } from '../config';
import { DetectedAction } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ActionDetectionService {
  private openai: OpenAI;
  private model: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    this.model = "gpt-4o-mini";
  }

  async detectActions(transcript: string, audioStart: number = 0, audioEnd: number = 0, detectedActionsPrevious: DetectedAction[] = []): Promise<DetectedAction[]> {
    try {
      const prompt = this.buildActionDetectionPrompt(transcript);
      
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: `Already detected actions (don't detect same actions again): ${JSON.stringify(detectedActionsPrevious)}\n\nTranscript: ${transcript}`,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return [];
      }

      return this.parseActionResponse(content, audioStart, audioEnd);
    } catch (error) {
      console.error('Failed to detect actions:', error);
      return [];
    }
  }

  private buildActionDetectionPrompt(transcript: string): string {
    return `You are an AI assistant that scans ordinary conversation transcripts—dialogue between other people or even someone’s inner monologue—to capture **every** actionable item, no matter how small.  
Classify each item as one of three types:

1. **TODO** – Any task, chore, reminder, or thing to be done  
2. **CALENDAR** – Any appointment, deadline, event, promise, or plan tied to a date or time  
3. **RESEARCH** – Any request to investigate, check, look up, or gather information  

Return the findings as a JSON array of objects with this structure:

{
  "type": "todo | calendar | research",
  "title": "Brief descriptive title",
  "body": "Detailed description (for TODO items; optional but recommended)",
  "query": "Search query or question (for RESEARCH items)",
  "datetime": "ISO 8601 datetime string (for CALENDAR items when a specific date/time is mentioned)",
  "related_transcript": "The related transcript of the action" // capture as much as possible of the related transcript
}

### Extraction Rules
- **Catch everything**: If an utterance explicitly or implicitly points to an action—even a casual “I should … someday”—include it.  
- **CALENDAR**: You need to have the date at least to classify it as a CALENDAR item.
- **TODO**: Speaker or assignee doesn’t matter. Self-talk counts. Conditional or tentative phrasing counts.  
  - Example: “I guess I ought to clean the garage” → TODO  
- **RESEARCH**: Anything that clearly asks for information or clarification.  
  - Example: “What’s the new AWS pricing?” → RESEARCH  
- **De-duplicate**: Skip actions that were already listed in the previous output unless new details have been added.  
- **Updates override**: If an action is modified later in the conversation, keep only the latest version.  
- **Err on the side of inclusion** when the statement strongly suggests action.

### Examples
- “Set up a meeting tomorrow at 3 PM.” → CALENDAR (with "datetime")
- “I’ll look over the slides later.” → TODO
- “Can you find out the exchange rate?” → RESEARCH
- “I promise to send the report by Friday.” → TODO
- “Let’s grab lunch sometime next month.” → CALENDAR (no "datetime")

Respond **only** with the resulting JSON array. If no actions are found, return [].
`;
  }

  private parseActionResponse(
    response: string,
    audioStart: number,
    audioEnd: number
  ): DetectedAction[] {
    try {
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const actions = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(actions)) {
        return [];
      }

      return actions
        .filter(this.validateAction)
        .map((action: any) => this.formatDetectedAction(action, audioStart, audioEnd));
    } catch (error) {
      console.error('Failed to parse action response:', error);
      return [];
    }
  }

  private validateAction(action: any): boolean {
    return (
      action &&
      typeof action === 'object' &&
      ['todo', 'calendar', 'research'].includes(action.type) &&
      typeof action.title === 'string' &&
      action.title.trim().length > 0
    );
  }

  private formatDetectedAction(
    action: any,
    audioStart: number,
    audioEnd: number
  ): DetectedAction {
    const detectedAction: DetectedAction = {
      type: action.type,
      id: uuidv4(),
      inner: {
        title: action.title.trim(),
      },
      relate: {
        start: audioStart,
        end: audioEnd,
        transcript: action.related_transcript,
      },
    };

    // Add type-specific fields
    switch (action.type) {
      case 'todo':
        if (action.body && typeof action.body === 'string') {
          detectedAction.inner.body = action.body.trim();
        }
        break;
      
      case 'calendar':
        if (action.datetime && typeof action.datetime === 'string') {
          // Validate and format datetime
          try {
            const date = new Date(action.datetime);
            if (!isNaN(date.getTime())) {
              detectedAction.inner.datetime = date.toISOString();
            }
          } catch (error) {
            console.warn('Invalid datetime format:', action.datetime);
          }
        }
        break;
      
      case 'research':
        if (action.query && typeof action.query === 'string') {
          detectedAction.inner.query = action.query.trim();
        } else {
          // If no specific query provided, use the title as query
          detectedAction.inner.query = action.title.trim();
        }
        break;
    }

    return detectedAction;
  }

  async generateConversationSummary(transcript: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that creates concise summaries of conversation transcripts. 
            Create a brief, informative summary that captures the main topics discussed and key points mentioned. 
            Keep the summary under 200 words and focus on the most important information.`,
          },
          {
            role: 'user',
            content: `Please summarize this conversation transcript:\n\n${transcript}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      });

      return response.choices[0]?.message?.content?.trim() || 'No summary available';
    } catch (error) {
      console.error('Failed to generate conversation summary:', error);
      return 'Summary generation failed';
    }
  }

  async generateConversationTitle(transcript: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that creates a concise title for a conversation transcript.
            Create a brief, informative title that captures the main topics discussed and key points mentioned.
            Keep the title under 200 words and focus on the most important information.`,
          },
          {
            role: 'user',
            content: `Please generate a title for this conversation transcript:\n\n${transcript}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      });

      return response.choices[0]?.message?.content?.trim() || 'No title available';
    } catch (error) {
      console.error('Failed to generate conversation title:', error);
      return 'Title generation failed';
    }
  }

  async generateConversationLogs(transcript: string): Promise<Array<{
    speaker: 'user' | 'assistant';
    summary: string;
    transcript_excerpt: string;
    start_time: number;
    end_time: number;
  }>> {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that breaks down conversation transcripts into logical segments with summaries.
            
            Analyze the transcript and create conversation logs that represent different topics or speakers.
            For each segment, provide:
            - speaker: "user" or "assistant" (determine based on context)
            - summary: Brief description of what was discussed in this segment
            - transcript_excerpt: Key portion of the transcript for this segment
            - estimated timing (start_time and end_time in milliseconds, distribute evenly across the conversation)
            
            Respond with a JSON array of log objects. Aim for 3-8 segments depending on conversation length.`,
          },
          {
            role: 'user',
            content: transcript,
          },
        ],
        temperature: 0.2,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return [];
      }

      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return [];
      }

      const logs = JSON.parse(jsonMatch[0]);
      return Array.isArray(logs) ? logs : [];
    } catch (error) {
      console.error('Failed to generate conversation logs:', error);
      return [];
    }
  }
}

export const actionDetectionService = new ActionDetectionService();
