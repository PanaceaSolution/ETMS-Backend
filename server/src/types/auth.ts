import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface TokenPayload extends JwtPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  userId?: string;
  token?: string;
}
