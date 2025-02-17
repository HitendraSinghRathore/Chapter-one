import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthConfig, DecodedUser } from '../types/interface.types';

export function authMiddleware(roles?: Array<'admin' | 'regular'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const sessionIdHeader = req.headers['x-session-id']; 

      if (roles && roles.length > 0) {
       
        if (!authHeader) {
          return res.status(401).json({ message: 'No token provided' });
        }

        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer' || !token) {
          return res.status(401).json({ message: 'Invalid token format' });
        }

        const decoded = jwt.verify(
          token,
          config.get<AuthConfig>('auth').jwtSecret
        ) as DecodedUser;
        req.user = decoded;

       
        if (!roles.includes(decoded.role)) {
          return res.status(403).json({ message: 'Forbidden: insufficient role' });
        }

        return next();
      }

     
      if (authHeader) {
 
        const [scheme, token] = authHeader.split(' ');
        if (scheme === 'Bearer' && token) {
          const decoded = jwt.verify(
            token,
            config.get<AuthConfig>('auth').jwtSecret
          ) as DecodedUser;
          req.user = decoded;
        }
      } else if (sessionIdHeader) {
      
        if (typeof sessionIdHeader === 'string') {
          req.user = { id: sessionIdHeader };
        }
      } else {
        return res.status(401).json({ message: 'No session token provided' });
      }
      return next();
    } catch (error) {
      console.error('Error while verifying JWT:', error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  };
}
