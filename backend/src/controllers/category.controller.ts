import { Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class CategoryController {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await categoryService.getAll(req.user.userId)); } catch (e) { next(e); }
  }
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.status(201).json(await categoryService.create(req.user.userId, req.body)); } catch (e) { next(e); }
  }
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.json(await categoryService.update(req.user.userId, parseInt(req.params.id as string), req.body)); } catch (e) { next(e); }
  }
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try { await categoryService.delete(req.user.userId, parseInt(req.params.id as string)); res.status(204).send(); } catch (e) { next(e); }
  }
  async seed(req: AuthRequest, res: Response, next: NextFunction) {
    try { res.status(201).json(await categoryService.seed(req.user.userId)); } catch (e) { next(e); }
  }
}
export const categoryController = new CategoryController();
