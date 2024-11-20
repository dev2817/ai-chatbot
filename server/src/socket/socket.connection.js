import { Server } from 'socket.io';
import { chatService } from "../services/chat.services.js"
import logger from '../utils/logger.js';
let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            logger.info(`User ${socket.id} joined room ${roomId}`);
        });

        socket.on("sendMessage", async (data) => {
            try {
                const promptData = {
                    prompt: data.prompt,
                    files: data.files,
                    userId: data.userId,
                    chatId: data.chatId,
                    model: data.model
                }

                const message = await chatService.promptModel(promptData)

                io.to(data.chatId).emit("receiveMessage", {
                    message,
                });
            }
            catch (err) {
                logger.error("Failed to generate prompt", err);
            }

        });

        socket.on("disconnect", () => {
            logger.info("User disconnected:", socket.id);
        });
    });
};

export const getSocketInstance = () => io;

// import { Server } from 'socket.io';

// let io;

// export const initializeSocket = (server) => {
//     io = new Server(server, {
//         cors: {
//             origin: "*",
//             methods: ["GET", "POST"],
//         },
//     });

//     io.on("connection", (socket) => {
//         console.log("A user connected:", socket.id);

//         socket.on("joinRoom", (roomId) => {
//             socket.join(roomId);
//             console.log(`User ${socket.id} joined room ${roomId}`);
//         });

//         socket.on("sendMessage", (data) => {
//             const { chatId, message } = data;
//             io.to(chatId).emit("receiveMessage", message);
//         });

//         socket.on("disconnect", () => {
//             console.log("User disconnected:", socket.id);
//         });
//     });
// };

// export const getSocketInstance = () => io;
