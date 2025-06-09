import { Router, Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { validateRequest, schemas } from '../middleware/validation';
import { databaseService } from '../services/database';
import { ListActionsQuery, UpdateActionRequest } from '../types';

const router = Router();

// GET /actions - List actions
router.get(
  '/',
  validateRequest({ query: schemas.listActionsQuery }),
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
      const query = req.query as ListActionsQuery;
      
      const actions = await databaseService.listActions(authReq.userId, {
        conversationId: query.conversation_id,
        status: query.status,
        type: query.type,
      });

      res.json({ actions });
    } catch (error) {
      console.error('Failed to list actions:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve actions',
      });
    }
  }
);

// GET /action/:action_id - Get specific action
router.get(
  '/:action_id',
  validateRequest({ params: schemas.actionParams }),
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
      const { action_id } = req.params;
      
      const action = await databaseService.getAction(authReq.userId, action_id);
      
      if (!action) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Action not found',
        });
        return;
      }

      // Format response to match API specification
      const response = {
        type: action.type,
        created_at: action.created_at,
        updated_at: action.updated_at,
        status: action.status,
        id: action.id,
        conversation_id: action.conversation_id,
        inner: {
          title: action.title,
          ...(action.body && { body: action.body }),
          ...(action.query && { query: action.query }),
          ...(action.datetime && { datetime: action.datetime }),
        },
        relate: {
          start: action.transcript_start || 0,
          end: action.transcript_end || 0,
          transcript: action.transcript_excerpt || '',
        },
      };

      res.json(response);
    } catch (error) {
      console.error('Failed to get action:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve action',
      });
    }
  }
);

// PATCH /action/:action_id - Update action
router.patch(
  '/:action_id',
  validateRequest({ 
    params: schemas.actionParams,
    body: schemas.updateActionBody 
  }),
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
      const { action_id } = req.params;
      const { status } = req.body as UpdateActionRequest;
      
      // Check if action exists and belongs to user
      const existingAction = await databaseService.getAction(authReq.userId, action_id);
      if (!existingAction) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Action not found',
        });
        return;
      }

      // Update the action
      const updatedAction = await databaseService.updateAction(authReq.userId, action_id, {
        status,
      });

      res.json({
        id: updatedAction.id,
        status: updatedAction.status,
        updated_at: updatedAction.updated_at,
      });
    } catch (error) {
      console.error('Failed to update action:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to update action',
      });
    }
  }
);

export default router;
