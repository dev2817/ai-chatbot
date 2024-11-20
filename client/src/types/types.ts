export type Timeline = {
    label: string
    timelines:
    {
        title: string
        id: string
    }[]
}

export type ChatCard = {
    title: string
    description: string
}

export type Chat = {
    _id: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export type GroupedChats = {
    label: string;
    timelines: Timeline[];
};

type PromptFile = {
    url: string;
    mimeType: string;
};

export type PromptData = {
    userId: string;
    chatId: string;
    files?: PromptFile[];
    prompt: string;
};

export type Message = {
    _id: string;
    chatId: string;
    message: string;
    userId: string;
    image?: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export type MessageState = {
    messageList: Message[];
}

export type Chats = {
    _id: string;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    __v: number
}

export type ChatState = {
    chats: Timeline[]
}

export type UserIdState = {
    userId: string
}

export type UserDataState = {
    id: string,
    email: string,
    name: string,
    profileImage: string,
    username: string,
    isActive: boolean,
}

export type Model = {
    label: string;
    model: string;
}