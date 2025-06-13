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
  full_transcript: string;
}

export class ConversationMCPService {
  constructor() {
  }

  async searchConversations(args: SearchConversationsArgs) {
    //let { user_id, query, date_from, date_to, limit = 10 } = args;
    let user_id = args.user_id;
    let limit = 10;
    let query = "test";


    try {
      // Get conversations with optional date filtering
      const conversations = await databaseService.listConversations(user_id, {
        //status: 'active',
        limit: limit * 2, // Get more to filter and rank
      });

      // Filter conversations based on date range if provided
      let filteredConversations = conversations;
        /*
      if (date_from || date_to) {
        filteredConversations = conversations.filter(conv => {
          const convDate = new Date(conv.created_at);
          if (date_from && convDate <= new Date(date_from)) return false;
          if (date_to && convDate >= new Date(date_to)) return false;
          return true;
        });
      }*/

      // Search and rank conversations based on query
      const searchResults: ConversationSearchResult[] = [];
      const queryLower = query.toLowerCase();

      for (const conversation of filteredConversations) {
        searchResults.push({
          id: conversation.id,
          title: conversation.title,
          created_at: conversation.created_at,
          updated_at: conversation.updated_at,
          relevance_score: 1,
          preview: conversation.last_transcript_preview || 'No preview available',
        });
      }

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

        // Build full transcript from logs and main transcript
        const fullTranscript = conversation.transcript || "";

        contexts.push({
          conversation,
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
