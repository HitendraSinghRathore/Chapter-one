import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthConfig, AuthUser } from '../types/interface.types';

export function authMiddleware(roles?: Array<'admin' | 'regular'>):RequestHandler {
  return (req: Request, res: Response, next: NextFunction):void => {
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
           return
        }

        const decoded = jwt.verify(
          token,
          config.get<AuthConfig>('auth').jwtSecret
        ) as AuthUser;
        req.user = decoded;

       
        if (!roles.includes(decoded.role as 'admin' | 'regular')) {
           res.status(403).json({ message: 'Forbidden: insufficient role' });
           return
        }

         next();
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
      } else if (sessionIdHeader) {
      
        if (typeof sessionIdHeader === 'string') {
          req.user = { id: sessionIdHeader, role: 'regular' };
        }
      } else {
         res.status(401).json({ message: 'No session token provided' });
         return
      }
       next();
    } catch (error) {
      console.error('Error while verifying JWT:', error);
      res.status(401).json({ message: 'Unauthorized' });
       return
    }
  };
}
