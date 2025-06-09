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

  async detectActions(transcript: string, audioStart: number = 0, audioEnd: number = 0): Promise<DetectedAction[]> {
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
            content: transcript,
          },
        ],
        temperature: 0.1,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        return [];
      }

      return this.parseActionResponse(content, transcript, audioStart, audioEnd);
    } catch (error) {
      console.error('Failed to detect actions:', error);
      return [];
    }
  }

  private buildActionDetectionPrompt(transcript: string): string {
    return `You are an AI assistant that analyzes conversation transcripts to detect actionable items. Your task is to identify three types of actions:

1. **TODO**: Tasks, assignments, or things that need to be done
2. **CALENDAR**: Meetings, appointments, events, or time-based commitments
3. **RESEARCH**: Questions, topics to investigate, or information to look up

For each detected action, respond with a JSON array containing objects with this structure:
{
  "type": "todo|calendar|research",
  "title": "Brief descriptive title",
  "body": "Detailed description (for todo items)",
  "query": "Search query or question (for research items)",
  "datetime": "ISO 8601 datetime string (for calendar items, if specific time mentioned)"
}

Guidelines:
- Only detect clear, actionable items mentioned in the conversation
- For TODO items: Include tasks, assignments, reminders, or things to complete
- For CALENDAR items: Include meetings, appointments, deadlines, or scheduled events
- For RESEARCH items: Include questions to answer, topics to investigate, or information to find
- Extract specific datetime information when mentioned (e.g., "meeting at 3pm tomorrow")
- If no specific time is mentioned for calendar items, omit the datetime field
- Be conservative - only extract items that are clearly actionable
- Return an empty array if no actions are detected

Examples:
- "I need to buy groceries" → TODO
- "Let's schedule a meeting for tomorrow at 2pm" → CALENDAR
- "Can you look up the weather forecast?" → RESEARCH
- "Remind me to call John" → TODO
- "What's the capital of France?" → RESEARCH

*but not limited to these examples.

Respond only with valid JSON array, no additional text.`;
  }

  private parseActionResponse(
    response: string,
    transcript: string,
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
        .map((action: any) => this.formatDetectedAction(action, transcript, audioStart, audioEnd));
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
    transcript: string,
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
        transcript: transcript,
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
