import { chatApi } from '@/apis/authApis';
import { setChatList } from '@/features/chatSlice';
import { selectDarkMode, setDarkMode } from '@/features/darkModeSlice';
import { setMessagesList, addMessages } from '@/features/messageSlice';
import { selectModel, setModel } from '@/features/modelSlice';
import { selectUserId } from '@/features/userSlice';
import { firebase } from '@/pages/auth/utils/firebaseConfig';
import { Chat, Model, PromptData, Timeline } from '@/types/types';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from "socket.io-client";
import { maxFileSize, models, supportedMimes } from './constants';

type ChatContextType = {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    userId: string;
    chatId: string;
    setChatId: React.Dispatch<React.SetStateAction<string>>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (data: File | null) => void;
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    handleSubmit: () => Promise<void>;
    socket: Socket | null;
    joinRoom: (roomId: string) => void;
    toggleDarkMode: () => void;
    handleDeleteChat: (chatId: string) => void;
    handleChangeModel: (value: string) => void;
};


export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [message, setMessage] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [chatId, setChatId] = useState<string>("");
    const darkMode = useSelector(selectDarkMode);
    const userId = useSelector(selectUserId);
    const selectedModel = useSelector(selectModel);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = async (e: any) => {
        setMessage(e.target.value)
    }

    const handleFileChange = async (data: File | null) => {
        if (!data) {
          console.error("No file selected.");
          return;
        }
      
        const { type, size } = data;
      
        if (!supportedMimes.includes(type)) {
            toast.error("The selected file type is not supported.");
          console.error("Unsupported file type:", type);
          return;
        }
      
        if (size > maxFileSize) {
            toast.error("The file size exceeds the 5MB limit.");
          console.error("File size exceeds the limit:", size);
          return;
        }
      
        console.log("File is valid:", data);
        setFile(data);
      };


    const handleSubmit = async () => {
        if (!message && !file) {
            toast.error("Please provide a message or a file.");
            return;
        }
        try {
            let fileUrl: string | undefined;

            if (file) {
                fileUrl = await fileToFirebase(file as File);
                console.log(fileUrl);
            }

            const data = {
                userId,
                chatId,
                prompt: message,
                model: selectedModel.model,
                files: file && fileUrl ? [{ url: fileUrl, mimeType: file.type }] : []
            };

            setMessage('');
            setFile(null);
            if (chatId) {
                await sendMessagePrompt(data);
            }
            else {
                const response = await chatApi.promptAi(data);
                if (response.data.success) {
                    if (response.data.newChat) {
                        joinRoom(response.data.chatId)
                        getMessages(response.data.chatId);
                        getAllChats()
                        navigate(`/chat/${response.data.chatId}`)
                    }
                    return;
                }
                toast.error(response.data.message)
                console.log("failed", response.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong!");
        }
    };

    const getMessages = async (chatId: string) => {
        try {
            const response = await chatApi.getChatMessages(chatId)
            if (response.data.success) {
                dispatch(setMessagesList(response.data.data));
                return
            }
            toast.error(response.data.message)
        }
        catch (err: any) {
            console.log(err);
            toast.error("Something went wrong!")
        }
    }

    const groupChatsByDate = (chats: Chat[]): Timeline[] => {
        const groupedChats: Record<string, { title: string; id: string }[]> = {};

        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const startOfYear = new Date(today.getFullYear(), 0, 1);

        chats.forEach((chat) => {
            const chatDate = new Date(chat.createdAt);

            let label: string;

            if (chatDate.toDateString() === today.toDateString()) {
                label = "Today";
            } else if (chatDate.toDateString() === yesterday.toDateString()) {
                label = "Yesterday";
            } else if (chatDate >= sevenDaysAgo) {
                label = "Previous 7 Days";
            } else if (chatDate >= startOfMonth) {
                label = "Previous Month";
            } else if (chatDate >= startOfYear) {
                label = "Previous Year";
            } else {
                label = "Old Chats";
            }

            if (!groupedChats[label]) {
                groupedChats[label] = [];
            }

            groupedChats[label].push({
                id: chat._id,
                title: chat.name,
            });
        });

        return Object.entries(groupedChats).map(([label, timelines]) => ({
            label,
            timelines,
        }));
    };


    const getAllChats = async () => {
        try {
            const response = await chatApi.getChats(userId);
            if (response.data.success) {
                const grouped = groupChatsByDate(response.data.data)
                dispatch(setChatList(grouped))
                return
            }
            toast.error(response.data.message)
        }
        catch (err) {
            console.log(err);
            toast.error("Something went wrong!")
        }
    }

    useEffect(() => {
        getAllChats()
    }, [])

    useEffect(() => {
        if (chatId) {
            getMessages(chatId)
        }
    }, [chatId])

    const applyMessages = (message: any) => {
        if (message.success) {
            dispatch(addMessages(message.messages));
        } else {
            toast.error(message.message);
        }
    };

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BACKEND_SOCKET_URL);
        setSocket(newSocket);

        newSocket.on("receiveMessage", (message) => {
            applyMessages(message.message);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const joinRoom = (roomId: string) => {
        socket?.emit("joinRoom", roomId);
    };

    const fileToFirebase = async (file: File): Promise<string | undefined> => {
        try {
            const storageRef = firebase.ref(firebase.storage, `ai-chatbot-images/${chatId}-${file.name}-${Date.now()}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error('Error uploading file:', error);
            return undefined;
        }
    };

    const sendMessagePrompt = async (data: PromptData) => {
        socket?.emit("sendMessage", data);
    }


    const toggleDarkMode = () => {
        dispatch(setDarkMode(!darkMode))
        if (!darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const handleDeleteChat = async (chatId: string) => {
        try {
            const response = await chatApi.deleteChats({ chatId, userId });
            console.log(response.data);
            if (response.data.success) {
                toast.success("Chat deleted successfully!");
                await getAllChats()
                setChatId('');
                navigate("/chat")
                return
            }
            toast.error(response.data.message)
        }
        catch (err: any) {
            toast.error("Something went wrong")
            console.log(err);
        }
    }

    const handleChangeModel = (value: string) => {
        const model = models.find((model) => model.label === value) as Model
        dispatch(setModel(model))
        setChatId("");
        navigate('/chat');
    }

    return (
        <ChatContext.Provider value={{
            message,
            setMessage,
            userId,
            chatId,
            setChatId,
            handleChange,
            handleFileChange,
            file,
            setFile,
            handleSubmit,
            socket,
            joinRoom,
            toggleDarkMode,
            handleDeleteChat,
            handleChangeModel
        }}>
            {children}
        </ChatContext.Provider>
    );
};
