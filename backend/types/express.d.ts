import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      email: string;
      id: string;
      user?: JwtPayload;
    }
  }
}

export {};
