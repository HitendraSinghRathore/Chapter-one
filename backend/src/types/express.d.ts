import { AuthUser } from './interface.types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

export {};