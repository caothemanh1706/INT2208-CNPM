import { Router } from 'express';
import authRoutes from './auth.routes';
import transactionRoutes from './transaction.routes';
import budgetRoutes from './budget.routes';
import noteRoutes from './note.routes';
import categoryRoutes from './category.routes';
import accountRoutes from './account.routes';
import otherRoutes from './other.routes';
import chatRoutes from './chat.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/notes', noteRoutes);
router.use('/categories', categoryRoutes);
router.use('/accounts', accountRoutes);
router.use('/assistant', chatRoutes);
router.use('/', otherRoutes);

export default router;
