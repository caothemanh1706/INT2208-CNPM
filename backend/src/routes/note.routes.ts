import { Router } from 'express';
import { noteController } from '../controllers/note.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();
router.use(authenticateJWT);
router.get('/', noteController.getAll);
router.post('/', noteController.create);
router.put('/:id', noteController.update);
router.delete('/:id', noteController.delete);

export default router;
