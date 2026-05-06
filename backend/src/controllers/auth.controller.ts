import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (e: any) { res.status(401).json({ error: e.message }); }
  }
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body);
      res.json(result);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  }
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword(req.body);
      res.json(result);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  }
  async changePassword(req: any, res: Response, next: NextFunction) {
    try {
      const result = await authService.changePassword(req.user.userId, req.body);
      res.json(result);
    } catch (e: any) { res.status(400).json({ error: e.message }); }
  }
}
export const authController = new AuthController();
