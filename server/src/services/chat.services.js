import logger from "../utils/logger.js"
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import { Message } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";

const geminiApiKey = process.env.GEMINI_API_KEY;
const chatbotUserId = process.env.CHATBOT_USER_ID;

const convertFilesToGenerativeParts = async (files) => {
    const filePromises = files?.map(async (file) => {
        const { data } = await axios.get(file?.url, { responseType: 'arraybuffer' });

        const base64Data = Buffer.from(data).toString('base64');

        return {
            inlineData: {
                data: base64Data,
                mimeType: file?.mimeType,
            },
        };
    });
    return await Promise.all(filePromises);
};

const getMessagesForPrompt = async (prompt, chatId) => {
    try {
        let messages = [];
        if (chatId) {
            messages = await Message.find({ chatId, isActive: true })
                .sort({ createdAt: -1 })
                .limit(4);
        }
        let formattedMessages = [];

        if (messages.length > 0) {
            formattedMessages = messages?.reverse()?.map((msg) => ({
                user: msg?.userId?.toString() === chatbotUserId ? "ai" : "user",
                message: msg?.message,
            }));
        }

        formattedMessages?.push({
            user: "user",
            message: prompt,
        });

        return {
            success: true,
            data: formattedMessages,
        };
    } catch (err) {
        logger.error("Error getting messages", err);
        return {
            success: false,
            message: "Error getting messages!",
        };
    }
};

const promptGemini = async (prompt, files, userId, chatId, selectedModel) => {
    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        /*
        gemini-1.0-pro
        gemini-1.5-flash
        gemini-1.5-pro
        gemini-1.5-flash-8b
        */

        const model = genAI.getGenerativeModel({ model: selectedModel });
        const formattedMessages = await getMessagesForPrompt(prompt, chatId)
        const newPrompt = `Behave as a highly advanced generative AI model, engaging in a conversation with a user. Provide comprehensive, clear, and accurate responses based on the context of the conversation. Ensure your answers are well-structured and maintain a natural conversational flow. Respond in plain text format, avoiding any list or array format unless explicitly requested by the user. Tailor your responses to the nuances of the user's prompts and ensure they align with the established context.
        conversation: ${JSON.stringify(formattedMessages.data)}`
        let result;

        if (files.length === 0) {
            result = await model.generateContent(newPrompt);
        }
        if (files.length > 0) {
            const filesData = await convertFilesToGenerativeParts(files)
            result = await model.generateContent([newPrompt, ...filesData]);
        }
        if (result.response) {
            const message = await saveMessage({ chatId, image: files[0]?.url, message: prompt, userId })
            const promptMessage = await saveMessage({ chatId: message.chatId, message: result.response.text(), userId: chatbotUserId })

            return {
                chatId: chatId || message.chatId,
                newChat: message.newChat,
                data: result.response.text(),
                success: true,
                messages: [message.data, promptMessage.data],
                message: "Prompt generated successfully!"
            }

        }
        return {
            success: false,
            message: "Failed to generate prompt!"
        }
    }
    catch (err) {
        logger.error("Error generating prompt", err)
        return {
            success: false,
            message: "Failed to generate prompt!"
        }
    }
}


const promptModel = async (data) => {
    try {
        const prompt = await promptGemini(data.prompt, data.files, data.userId, data?.chatId, data?.model)
        return prompt;
    }
    catch (err) {
        logger.error("Error generating prompt", err)
        return {
            success: false,
            message: "Failed to generate prompt!"
        }
    }
}

const createChat = async ({ userId, name }) => {
    try {
        const newChat = await Chat.create({
            userId,
            name,
        });

        return { message: "Created chat successfully", success: true, data: newChat };
    } catch (error) {
        logger.error("Error creating chat", error);
        return {
            success: false,
            message: "Failed to create chat!"
        }
    }
};

const getChatsByUserId = async (userId) => {
    try {
        const chats = await Chat.find({ userId, isActive: true }).sort({ createdAt: -1 }).exec();
        return {
            message: "Chats got successfully",
            data: chats,
            success: true
        }
    } catch (error) {
        logger.error("Error fetching chats", error);
        return {
            success: false,
            message: "Failed to get chats!"
        }
    }
};

const saveMessage = async ({ chatId, message, image, userId }) => {
    try {
        let newChat = false;
        if (!chatId) {
            const chat = await createChat({ name: message, userId });
            chatId = chat.data._id.toString();
            newChat = true;
        } else {
            const chatExists = await Chat.findOne({ _id: chatId, isActive: true });

            if (!chatExists) {
                console.error("Chat ID provided does not exist.");
                const chat = await createChat({ name: message, userId });
                chatId = chat.data._id.toString();
                newChat = true;
            }
        }

        const newMessage = await Message.create({
            chatId,
            message,
            image,
            userId,
        });


        return { chatId, newChat, success: true, message: "Message saved successfully!", data: newMessage };
    } catch (error) {
        logger.error("Error saving messages", error);
        return {
            success: false,
            message: "Failed to save message!"
        }
    }
};

const getMessagesByChatId = async (chatId) => {
    try {
        const messages = await Message.find({ chatId, isActive: true })
            .sort({ createdAt: 1 })
            .exec();
        return { message: "Messages got successfully!", success: true, data: messages }
    } catch (error) {
        logger.error("Error get message", error);
        return {
            success: false,
            message: "Failed to get message!"
        }
    }
};

const deleteChatById = async (data) => {
    try {
        const chat = await Chat.findOneAndUpdate({ userId: data.userId, _id: data.chatId }, { isActive: false })
        if (chat) {
            return { message: "Chat deleted successfully!", data: chat, success: true }
        }
        return { message: "Couldn't find chat!", success: false }
    }
    catch (err) {
        logger.error("Error deleting chat", err);
        return {
            success: false,
            message: "Failed deleting chat!"
        }
    }
}

export const chatService = {
    promptModel,
    createChat,
    getChatsByUserId,
    saveMessage,
    getMessagesByChatId,
    deleteChatById
}