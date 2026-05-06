import { Router } from 'express';
import { otherController } from '../controllers/other.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateJWT);
router.get('/balance', otherController.getBalance);
router.get('/statistics/overview', otherController.getStatsOverview);
router.get('/statistics/trend', otherController.getTrend);
router.get('/profile', otherController.getProfile);
router.put('/profile', otherController.updateProfile);
router.get('/recurring', otherController.getRecurring);
router.post('/recurring', otherController.createRecurring);
router.put('/recurring/:id', otherController.updateRecurring);
router.delete('/recurring/:id', otherController.deleteRecurring);

export default router;
