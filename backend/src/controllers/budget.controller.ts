import { Response, NextFunction } from 'express';
import { budgetService } from '../services/budget.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class BudgetController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await budgetService.getAll(req.user.userId)); } catch (e) { next(e); }
  }
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.status(201).json(await budgetService.create(req.user.userId, req.body)); } catch (e) { next(e); }
  }
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await budgetService.update(req.user.userId, parseInt(req.params.id as string), req.body)); } catch (e) { next(e); }
  }
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try { await budgetService.delete(req.user.userId, parseInt(req.params.id as string)); res.status(204).send(); } catch (e) { next(e); }
  }
}
export const budgetController = new BudgetController();
