import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Forbidden: Invalid token' });
      req.user = user;
      
      try {
        fs.appendFileSync(
          path.resolve(__dirname, '../requests.log'),
          `${new Date().toISOString()} - Path: ${req.method} ${req.originalUrl} - User: ${JSON.stringify(user)}\n`
        );
      } catch (e) {}

      next();
    });
  } else {
    try {
      fs.appendFileSync(
        path.resolve(__dirname, '../requests.log'),
        `${new Date().toISOString()} - Path: ${req.method} ${req.originalUrl} - No token provided\n`
      );
    } catch (e) {}
    res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
};
