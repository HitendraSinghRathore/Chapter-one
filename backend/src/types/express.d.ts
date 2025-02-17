import { AuthUser } from '../middleware/auth.middleware';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

export {};