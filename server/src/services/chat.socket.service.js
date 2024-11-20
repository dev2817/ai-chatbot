import { getSocketInstance } from "../socket/socket.connection";

export const sendMessageToRoom = (roomId, message) => {
    const io = getSocketInstance();
    if (io) {
        io.to(roomId).emit("receiveMessage", message);
    }
};
