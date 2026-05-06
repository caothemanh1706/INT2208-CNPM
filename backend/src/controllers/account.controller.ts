import { Response, NextFunction } from 'express';
import { accountService } from '../services/account.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AccountController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await accountService.getAll(req.user.userId)); } catch (e) { next(e); }
  }
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.status(201).json(await accountService.create(req.user.userId, req.body)); } catch (e) { next(e); }
  }
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await accountService.update(req.user.userId, parseInt(req.params.id as string), req.body)); } catch (e) { next(e); }
  }
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try { await accountService.delete(req.user.userId, parseInt(req.params.id as string)); res.status(204).send(); } catch (e) { next(e); }
  }
}
export const accountController = new AccountController();
