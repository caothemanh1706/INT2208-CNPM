import { Router } from 'express';
import { budgetController } from '../controllers/budget.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateJWT);
router.get('/', budgetController.getAll);
router.post('/', budgetController.create);
router.put('/:id', budgetController.update);
router.delete('/:id', budgetController.delete);

export default router;
