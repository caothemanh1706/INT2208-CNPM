import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// Endpoint for sending message to the chatbox
router.post(['/', ''], authenticateJWT, chatController.sendMessage);

export default router;
