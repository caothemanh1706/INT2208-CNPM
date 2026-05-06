import { Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service';

export class ChatController {
  async sendMessage(req: any, res: Response, next: NextFunction) {
    try {
      const { message } = req.body;
      const userId = req.user?.userId || 'anonymous';
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const result = await chatService.processMessage(userId, message);
      res.json(result);
    } catch (e: any) { 
      res.status(500).json({ error: e.message }); 
    }
  }
}

export const chatController = new ChatController();
