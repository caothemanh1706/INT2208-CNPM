import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateJWT);
router.get('/', transactionController.getAll);
router.post('/', transactionController.create);
router.put('/:id', transactionController.update);
router.delete('/:id', transactionController.delete);

export default router;
