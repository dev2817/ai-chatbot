import { RootState } from '@/store/store';
import { UserIdState } from '@/types/types';
import { createSlice } from '@reduxjs/toolkit';

const initialState: UserIdState = {
    userId: "",
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        clearUserId: (state) => {
            state.userId = "";
        },
    },
});

export const { setUserId, clearUserId } = userSlice.actions;
export const selectUserId = (state: RootState) => state.user.userId;
export default userSlice.reducer;
