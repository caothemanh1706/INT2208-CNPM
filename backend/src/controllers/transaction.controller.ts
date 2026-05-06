import { Response, NextFunction } from 'express';
import { transactionService } from '../services/transaction.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class TransactionController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await transactionService.getAll(req.user.userId)); }
    catch (e) { next(e); }
  }
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.status(201).json(await transactionService.create(req.user.userId, req.body)); }
    catch (e) { next(e); }
  }
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await transactionService.update(req.user.userId, parseInt(req.params.id as string), req.body)); }
    catch (e) { next(e); }
  }
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try { await transactionService.delete(req.user.userId, parseInt(req.params.id as string)); res.status(204).send(); }
    catch (e) { next(e); }
  }
}
export const transactionController = new TransactionController();
