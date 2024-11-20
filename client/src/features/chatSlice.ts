import { RootState } from "@/store/store";
import { ChatState, Timeline } from "@/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ChatState = {
    chats: []
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setChatList: (state, action: PayloadAction<Timeline[]>) => {
            state.chats = action.payload
        },
        clearChatList: (state) => {
            state.chats = []
        }
    }
})

export const selectChats = (state: RootState) => state.chat.chats;
export const { setChatList, clearChatList } = chatSlice.actions
export default chatSlice.reducer;