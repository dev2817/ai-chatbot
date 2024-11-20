import { chatService } from "../services/chat.services.js"
import logger from "../utils/logger.js"

const prompt = async (req, res) => {
    try {
        const data = {
            prompt: req.body.prompt,
            files: req.body.files || [],
            userId: req.body.userId,
            chatId: req.body.chatId,
            model: req.body.model,
        }
        const result = await chatService.promptModel(data);
        res.send(result);

    } catch (err) {
        logger.error("Error generating prompt", err);
        res.send({
            success: false,
            message: "Failed to generate prompt!"
        });
    }
};

const createAiChat = async (req, res) => {
    try {
        const result = await chatService.createChat(req.body);
        res.send(result);
    } catch (err) {
        logger.error("Error generating prompt", err);
        res.send({
            success: false,
            message: "Failed to generate prompt!"
        });
    }
};

const getChats = async (req, res) => {
    try {
        const result = await chatService.getChatsByUserId(req.params.userId);
        res.send(result);
    } catch (err) {
        logger.error("Error generating prompt", err);
        res.send({
            success: false,
            message: "Failed to generate prompt!"
        });
    }
};

const createMessage = async (req, res) => {
    try {
        const result = await chatService.saveMessage(req.body);
        res.send(result);
    } catch (err) {
        logger.error("Error generating prompt", err);
        res.send({
            success: false,
            message: "Failed to generate prompt!"
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const result = await chatService.getMessagesByChatId(req.params.chatId);
        res.send(result);
    } catch (err) {
        logger.error("Error generating prompt", err);
        res.send({
            success: false,
            message: "Failed to generate prompt!"
        });
    }
};

const deleteChat = async (req, res) => {
    try {
        const result = await chatService.deleteChatById(req.body);
        res.send(result);
    } catch (err) {
        logger.error("Error generating prompt", err);
        res.send({
            success: false,
            message: "Failed to generate prompt!"
        });
    }
};


export const chatController = {
    prompt,
    createAiChat,
    getChats,
    createMessage,
    getMessages,
    deleteChat
}