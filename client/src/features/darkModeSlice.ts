import { RootState } from "@/store/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const darkModeSlice = createSlice({
    name: "darkMode",
    initialState: {
        darkMode: false
    },
    reducers: {
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.darkMode = action.payload;
        }
    }
})

export const selectDarkMode = (state: RootState) => state.dark.darkMode;
export const { setDarkMode } = darkModeSlice.actions;
export default darkModeSlice.reducer;