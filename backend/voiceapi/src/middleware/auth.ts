import { Request, Response, NextFunction } from 'express';
import { AuthHeaders } from '../types';

export interface AuthenticatedRequest extends Request {
  userId: string;
  apiKey: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authorization = req.headers.authorization;
    const userId = req.headers['oto_user_id'] as string;

    if (!authorization) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authorization header is required',
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'OTO_USER_ID header is required',
      });
      return;
    }

    // Extract API key from Authorization header
    const apiKey = authorization.startsWith('Bearer ') 
      ? authorization.slice(7) 
      : authorization;

    if (!apiKey) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid authorization format',
      });
      return;
    }

    // In a real implementation, you would validate the API key against a database
    // For now, we'll just check if it exists and has a reasonable format
    if (apiKey.length < 10) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid API key',
      });
      return;
    }

    // Add user info to request
    (req as AuthenticatedRequest).userId = userId;
    (req as AuthenticatedRequest).apiKey = apiKey;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed',
    });
  }
}

export function wsAuthMiddleware(headers: any): { userId: string; apiKey: string } | null {
  try {
    console.log('headers', headers);
    const authorization = headers.authorization;
    const userId = headers.oto_user_id;

    if (!authorization || !userId) {
      return null;
    }

    const apiKey = authorization.startsWith('Bearer ') 
      ? authorization.slice(7) 
      : authorization;

    console.log('apiKey', apiKey);

    if (!apiKey || apiKey.length < 10) {
      return null;
    }

    return { userId, apiKey };
  } catch (error) {
    console.error('WebSocket authentication error:', error);
    return null;
  }
}
