import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AuthConfig } from '../types/interface.types';

export interface DecodedUser {
    id: number;
    email: string;
    role: 'admin' | 'regular';
    iat?: number;
    exp?: number;
  }

  
  export function authMiddleware(roles?: Array<'admin' | 'regular'>) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const authHeader = req.headers.authorization; // e.g., "Bearer <token>"
        if (!authHeader) {
          return res.status(401).json({ message: 'No token provided' });
        }
  
        const [scheme, token] = authHeader.split(' ');
        if (scheme !== 'Bearer' || !token) {
          return res.status(401).json({ message: 'Invalid token format' });
        }
  
        // Verify the JWT
        const decoded = jwt.verify(token, config.get<AuthConfig>('auth').jwtSecret) as DecodedUser;
        req.user = decoded; // Attach to Request
  
        // If roles are provided, check if user's role is allowed
        if (roles && roles.length > 0) {
          if (!roles.includes(decoded.role)) {
            return res.status(403).json({ message: 'Forbidden: insufficient role' });
          }
        }
  
        next();
      } catch (error) {
        console.error('Error while verifying JWT:', error);
        return res.status(401).json({ message: 'Unauthorized' });
      }
    };
  }