import { RootState } from '@/store/store';
import { Message, MessageState } from '@/types/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: MessageState = {
    messageList: [],
};

const messageSlice = createSlice({
    name: 'messageList',
    initialState,
    reducers: {
        setMessagesList: (state, action: PayloadAction<Message[]>) => {
            state.messageList = action.payload;
        },
        clearMessagesList: (state) => {
            state.messageList = [];
        },
        addMessages: (state, action: PayloadAction<Message[]>) => {
            state.messageList = [...state.messageList, ...action.payload];
        },
    },
});

export const selectMessages = (state: RootState) => state.message.messageList;
export const { setMessagesList, clearMessagesList, addMessages } = messageSlice.actions;
export default messageSlice.reducer;
