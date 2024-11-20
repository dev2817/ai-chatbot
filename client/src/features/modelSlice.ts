import { RootState } from "@/store/store";
import { models } from "@/utils/constants";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const modelSlice = createSlice({
    name: "model",
    initialState: {
        model: models[2]
    },
    reducers: {
        setModel: (state, action: PayloadAction<{ model: string, label: string }>) => {
            state.model = action.payload;
        }
    }
})

export const selectModel = (state: RootState) => state.model.model;
export const { setModel } = modelSlice.actions;
export default modelSlice.reducer;