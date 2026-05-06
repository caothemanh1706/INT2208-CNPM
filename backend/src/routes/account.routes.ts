import { Router } from 'express';
import { accountController } from '../controllers/account.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateJWT);
router.get('/', accountController.getAll);
router.post('/', accountController.create);
router.put('/:id', accountController.update);
router.delete('/:id', accountController.delete);

export default router;
