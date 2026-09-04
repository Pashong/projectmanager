import { JwtPayload } from 'jsonwebtoken';

export interface AuthPayload extends JwtPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export {};
