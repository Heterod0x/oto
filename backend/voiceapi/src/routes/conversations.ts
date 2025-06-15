import { Router, Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';
import { databaseService } from '../services/database';
import { transcriptionService } from '../services/transcription';
import { ListConversationsQuery, TranscriptFormat, ConversationLogsQuery } from '../types';
import { BeautifiedSegment } from '@/services/transcriptionBeautifier';

const router = Router();

// GET /conversations - List conversations
router.get(
  '/',
  validateRequest({ query: schemas.listConversationsQuery }),
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
      const query = req.query as ListConversationsQuery;
      
      const conversations = await databaseService.listConversations(authReq.userId, {
        status: query.status,
        updatedSince: query.updated_since,
        limit: query.limit,
        offset: query.offset,
      });

      res.json({ conversations });
    } catch (error) {
      console.error('Failed to list conversations:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve conversations',
      });
    }
  }
);

// GET /conversation/:conversation_id/audio_url - Get conversation audio URL
router.get(
  '/:conversation_id/audio_url',
  validateRequest({ params: schemas.conversationParams }),
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
      const { conversation_id } = req.params;
      
      const conversation = await databaseService.getConversation(authReq.userId, conversation_id);
      
      if (!conversation) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Conversation not found',
        });
        return;
      }

      if (!conversation.audio_url) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Audio not available for this conversation',
        });
        return;
      }

      res.json({
        conversation_id: conversation.id,
        audio_url: conversation.audio_url,
      });
    } catch (error) {
      console.error('Failed to get audio URL:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve audio URL',
      });
    }
  }
);

// GET /conversation/:conversation_id/transcript - Get full transcript
router.get(
  '/:conversation_id/transcript',
  validateRequest({ 
    params: schemas.conversationParams,
    query: schemas.transcriptQuery 
  }),
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
      const { conversation_id } = req.params;
      const { format = 'plain' } = req.query as { format?: string };
      
      const conversation = await databaseService.getConversation(authReq.userId, conversation_id);
      
      if (!conversation) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Conversation not found',
        });
        return;
      }

      if (!conversation.transcript) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Transcript not available for this conversation',
        });
        return;
      }

      const msToTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      };

      let transcriptObject = JSON.parse(conversation.transcript) as BeautifiedSegment[];
      let formattedTranscript = transcriptObject.map(segment => `[${msToTime(segment.audioStart)} - ${msToTime(segment.audioEnd)}] ${segment.beautifiedText}`).join('\n');

      // Convert transcript to requested format
      if (format === 'srt') {
        formattedTranscript = transcriptionService.convertToSRT(transcriptObject);
      } else if (format === 'vtt') {
        formattedTranscript = transcriptionService.convertToVTT(transcriptObject);
      }

      res.json({
        conversation_id: conversation.id,
        format,
        transcript: formattedTranscript,
      });
    } catch (error) {
      console.error('Failed to get transcript:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve transcript',
      });
    }
  }
);

// GET /conversation/:conversation_id/logs - Get conversation summary logs
router.get(
  '/:conversation_id/logs',
  validateRequest({ 
    params: schemas.conversationParams,
    query: schemas.conversationLogsQuery 
  }),
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
      const { conversation_id } = req.params;
      const query = req.query as ConversationLogsQuery;
      
      const conversation = await databaseService.getConversation(authReq.userId, conversation_id);
      
      if (!conversation) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Conversation not found',
        });
        return;
      }

      const logs = await databaseService.getConversationLogs(authReq.userId, conversation_id, {
        limit: query.limit,
        offset: query.offset,
      });

      // Format logs to match API specification
      const formattedLogs = logs.map(log => ({
        start: log.start_time,
        end: log.end_time,
        speaker: log.speaker,
        summary: log.summary,
        transcript_excerpt: log.transcript_excerpt || '',
      }));

      res.json({
        conversation_id: conversation.id,
        logs: formattedLogs,
      });
    } catch (error) {
      console.error('Failed to get conversation logs:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve conversation logs',
      });
    }
  }
);

export default router;
