import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthConfig, AuthUser } from '../types/interface.types';
import { User } from '../models/User';

export function authMiddleware(roles?: Array<'admin' | 'regular'>): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void > => {
    try {
      const authHeader = req.headers.authorization;
      const sessionIdHeader = req.headers['x-session-id'];

      if (roles && roles.length > 0) {
        if (!authHeader) {
           res.status(401).json({ message: 'No token provided' });
           return;
        }
        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer' || !token) {
           res.status(401).json({ message: 'Invalid token format' });
           return;
        }
        const decoded = jwt.verify(token, config.get<AuthConfig>('auth').jwtSecret) as AuthUser;
        req.user = decoded;

        const dbUser = await User.findOne({ where: { id: decoded.id } });
        if (!dbUser) {
           res.status(401).json({ message: 'Invalid token format' });
           return;
        }
        if (!roles.includes(dbUser.role as 'admin' | 'regular')) {
           res.status(403).json({ message: 'Forbidden: insufficient role' });
           return;
        }
        return next();
      }

      if (authHeader) {
        const [scheme, token] = authHeader.split(' ');
        if (scheme === 'Bearer' && token) {
          const decoded = jwt.verify(
            token,
            config.get<AuthConfig>('auth').jwtSecret
          ) as AuthUser;
          req.user = decoded;
        }
      } else if (sessionIdHeader && typeof sessionIdHeader === 'string') {
        req.user = { id: sessionIdHeader, role: 'regular' };
      } else {
         res.status(401).json({ message: 'No session token provided' });
         return;
      }
      return next();
    } catch (error) {
      console.error('Error while verifying JWT:', error);
       res.status(401).json({ message: 'Unauthorized' });
       return;
    }
  };
}
