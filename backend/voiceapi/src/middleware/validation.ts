import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export function validateRequest(schema: {
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  body?: Joi.ObjectSchema;
}) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Validate params
    if (schema.params) {
      const { error, value } = schema.params.validate(req.params);
      if (error) {
        errors.push(`Params: ${error.details.map(d => d.message).join(', ')}`);
      } else {
        req.params = value;
      }
    }

    // Validate query
    if (schema.query) {
      const { error, value } = schema.query.validate(req.query);
      if (error) {
        errors.push(`Query: ${error.details.map(d => d.message).join(', ')}`);
      } else {
        req.query = value;
      }
    }

    // Validate body
    if (schema.body) {
      const { error, value } = schema.body.validate(req.body);
      if (error) {
        errors.push(`Body: ${error.details.map(d => d.message).join(', ')}`);
      } else {
        req.body = value;
      }
    }

    if (errors.length > 0) {
      res.status(400).json({
        error: 'Validation Error',
        message: errors.join('; '),
      });
      return;
    }

    next();
  };
}

// Common validation schemas
export const schemas = {
  uuid: Joi.string().uuid().required(),
  
  listActionsQuery: Joi.object({
    conversation_id: Joi.string().uuid().optional(),
    status: Joi.string().valid('created', 'accepted', 'deleted', 'completed').optional(),
    type: Joi.string().valid('todo', 'calendar', 'research').optional(),
  }),

  updateActionBody: Joi.object({
    status: Joi.string().valid('created', 'accepted', 'deleted', 'completed').required(),
  }),

  listConversationsQuery: Joi.object({
    status: Joi.string().valid('active', 'archived').optional(),
    updated_since: Joi.string().isoDate().optional(),
    limit: Joi.string().pattern(/^\d+$/).custom((value, helpers) => {
      const num = parseInt(value, 10);
      if (num < 1 || num > 200) {
        return helpers.error('any.invalid');
      }
      return num;
    }).optional(),
    offset: Joi.string().pattern(/^\d+$/).custom((value, helpers) => {
      const num = parseInt(value, 10);
      if (num < 0) {
        return helpers.error('any.invalid');
      }
      return num;
    }).optional(),
  }),

  transcriptQuery: Joi.object({
    format: Joi.string().valid('plain', 'srt', 'vtt').default('plain').optional(),
  }),

  conversationLogsQuery: Joi.object({
    limit: Joi.string().pattern(/^\d+$/).custom((value, helpers) => {
      const num = parseInt(value, 10);
      if (num < 1 || num > 1000) {
        return helpers.error('any.invalid');
      }
      return num;
    }).optional(),
    offset: Joi.string().pattern(/^\d+$/).custom((value, helpers) => {
      const num = parseInt(value, 10);
      if (num < 0) {
        return helpers.error('any.invalid');
      }
      return num;
    }).optional(),
  }),

  conversationParams: Joi.object({
    conversation_id: Joi.string().uuid().required(),
  }),

  actionParams: Joi.object({
    action_id: Joi.string().uuid().required(),
  }),
};

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction): void {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      message: error.message,
    });
    return;
  }

  if (error.message.includes('not found') || error.message.includes('Not found')) {
    res.status(404).json({
      error: 'Not Found',
      message: error.message,
    });
    return;
  }

  if (error.message.includes('Unauthorized') || error.message.includes('unauthorized')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: error.message,
    });
    return;
  }

  if (error.message.includes('Forbidden') || error.message.includes('forbidden')) {
    res.status(403).json({
      error: 'Forbidden',
      message: error.message,
    });
    return;
  }

  // Default to 500 Internal Server Error
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
}
