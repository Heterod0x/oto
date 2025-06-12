import { databaseService } from '../../services/database';
import { Conversation, ConversationLog } from '../../types/index';

interface SearchConversationsArgs {
  user_id: string;
  query: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
}

interface GetConversationContextArgs {
  user_id: string;
  conversation_ids: string[];
}

interface ConversationSearchResult {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  relevance_score: number;
  preview: string;
}

interface ConversationContext {
  conversation: Conversation;
  logs: ConversationLog[];
  full_transcript: string;
}

export class ConversationMCPService {
  async searchConversations(args: SearchConversationsArgs) {
    let { user_id, query, date_from, date_to, limit = 10 } = args;
    
    // Extract user_id from query if it's in the format "[User ID: xxx] actual query"
    if (!user_id && query.startsWith('[User ID: ')) {
      const match = query.match(/^\[User ID: ([^\]]+)\] (.+)$/);
      if (match) {
        user_id = match[1];
        query = match[2];
      }
    }
    
    if (!user_id) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              query,
              total_found: 0,
              results: [],
              error: 'No user_id provided',
            }, null, 2),
          },
        ],
      };
    }

    try {
      // Get conversations with optional date filtering
      const conversations = await databaseService.listConversations(user_id, {
        status: 'active',
        limit: limit * 2, // Get more to filter and rank
      });

      // Filter conversations based on date range if provided
      let filteredConversations = conversations;
      if (date_from || date_to) {
        filteredConversations = conversations.filter(conv => {
          const convDate = new Date(conv.created_at);
          if (date_from && convDate < new Date(date_from)) return false;
          if (date_to && convDate > new Date(date_to)) return false;
          return true;
        });
      }

      // Search and rank conversations based on query
      const searchResults: ConversationSearchResult[] = [];
      const queryLower = query.toLowerCase();

      for (const conversation of filteredConversations) {
        let relevanceScore = 0;
        let matchedContent = '';

        // Search in title
        if (conversation.title) {
          const titleLower = conversation.title.toLowerCase();
          if (titleLower.includes(queryLower)) {
            relevanceScore += 10;
            matchedContent = conversation.title;
          }
        }

        // Search in transcript
        if (conversation.transcript) {
          const transcriptLower = conversation.transcript.toLowerCase();
          if (transcriptLower.includes(queryLower)) {
            relevanceScore += 5;
            // Find the context around the match
            const matchIndex = transcriptLower.indexOf(queryLower);
            const start = Math.max(0, matchIndex - 100);
            const end = Math.min(conversation.transcript.length, matchIndex + 200);
            matchedContent = conversation.transcript.substring(start, end);
          }
        }

        // Search in conversation logs
        const logs = await databaseService.getConversationLogs(user_id, conversation.id);
        for (const log of logs) {
          const summaryLower = log.summary.toLowerCase();
          if (summaryLower.includes(queryLower)) {
            relevanceScore += 3;
            if (!matchedContent) {
              matchedContent = log.summary;
            }
          }
          if (log.transcript_excerpt) {
            const excerptLower = log.transcript_excerpt.toLowerCase();
            if (excerptLower.includes(queryLower)) {
              relevanceScore += 2;
              if (!matchedContent) {
                matchedContent = log.transcript_excerpt;
              }
            }
          }
        }

        if (relevanceScore > 0) {
          searchResults.push({
            id: conversation.id,
            title: conversation.title,
            created_at: conversation.created_at,
            updated_at: conversation.updated_at,
            relevance_score: relevanceScore,
            preview: matchedContent || conversation.last_transcript_preview || 'No preview available',
          });
        }
      }

      // Sort by relevance score and limit results
      const rankedResults = searchResults
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, limit);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              query,
              total_found: rankedResults.length,
              results: rankedResults,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to search conversations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getConversationContext(args: GetConversationContextArgs) {
    const { user_id, conversation_ids } = args;

    try {
      const contexts: ConversationContext[] = [];

      for (const conversationId of conversation_ids) {
        const conversation = await databaseService.getConversation(user_id, conversationId);
        if (!conversation) {
          continue; // Skip if conversation not found
        }

        const logs = await databaseService.getConversationLogs(user_id, conversationId);
        
        // Build full transcript from logs and main transcript
        let fullTranscript = '';
        if (conversation.transcript) {
          fullTranscript = conversation.transcript;
        } else {
          // Build from logs if main transcript is not available
          fullTranscript = logs
            .sort((a, b) => a.start_time - b.start_time)
            .map(log => `[${log.speaker}]: ${log.transcript_excerpt || log.summary}`)
            .join('\n');
        }

        contexts.push({
          conversation,
          logs,
          full_transcript: fullTranscript,
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              contexts,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get conversation context: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
