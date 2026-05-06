import { Response, NextFunction } from 'express';
import { otherService } from '../services/other.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class OtherController {
  async getBalance(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.getBalance(req.user.userId)); } catch (e) { next(e); } }
  async getStatsOverview(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.getStatsOverview(req.user.userId)); } catch (e) { next(e); } }
  async getTrend(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.getTrend(req.user.userId)); } catch (e) { next(e); } }
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.getProfile(req.user.userId)); } catch (e) { next(e); } }
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.updateProfile(req.user.userId, req.body)); } catch (e) { next(e); } }
  async getRecurring(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.getRecurring(req.user.userId)); } catch (e) { next(e); } }
  async createRecurring(req: AuthRequest, res: Response, next: NextFunction) { try { res.status(201).json(await otherService.createRecurring(req.user.userId, req.body)); } catch (e) { next(e); } }
  async updateRecurring(req: AuthRequest, res: Response, next: NextFunction) { try { res.json(await otherService.updateRecurring(req.user.userId, parseInt(req.params.id as string), req.body)); } catch (e) { next(e); } }
  async deleteRecurring(req: AuthRequest, res: Response, next: NextFunction) { try { await otherService.deleteRecurring(req.user.userId, parseInt(req.params.id as string)); res.status(204).send(); } catch (e) { next(e); } }
}
export const otherController = new OtherController();
