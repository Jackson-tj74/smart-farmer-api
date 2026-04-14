import { Router } from 'express';
import { sendMessage, getChats, getMessages } from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth';

const chatRouter = Router();

chatRouter.use(authenticate); // Protect all chat routes

chatRouter.get('/', getChats);
chatRouter.post('/', sendMessage); // Creates new chat if no ID provided
chatRouter.get('/:chatId/messages', getMessages);
chatRouter.post('/:chatId/message', sendMessage);

export default chatRouter;