import express from 'express'
import { chatController } from '../controllers/chat.controller.js';

const router = express.Router();

router.route('/prompt').post(chatController.prompt)

router.route('/create-chat').post(chatController.createAiChat);

router.route('/get-chats/:userId').get(chatController.getChats);

router.route('/get-messages/:chatId').get(chatController.getMessages);

router.route('/create-message').post(chatController.createMessage);

router.route('/delete-chat').put(chatController.deleteChat);

export default router