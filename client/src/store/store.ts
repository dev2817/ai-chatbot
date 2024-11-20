import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import messageReducer from "@/features/messageSlice"
import chatReducer from '@/features/chatSlice'
import userReducer from '@/features/userSlice';
import userDataReducer from '@/features/userDataSlice';
import darkReducer from '@/features/darkModeSlice';
import modelReducer from '@/features/modelSlice';

const userPersistConfig = {
    key: 'user',
    storage,
};

const userDataPersistConfig = {
    key: 'userData',
    storage,
};

const messagePersistConfig = {
    key: 'message',
    storage,
};

const chatPersistConfig = {
    key: 'chat',
    storage,
};

const darkPersistConfig = {
    key: 'dark',
    storage,
};

const modelPersistConfig = {
    key: 'model',
    storage,
};

const persistedMessageReducer = persistReducer(messagePersistConfig, messageReducer);
const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedUserDataReducer = persistReducer(userDataPersistConfig, userDataReducer);
const persistedDarkModeReducer = persistReducer(darkPersistConfig, darkReducer);
const persistedModelReducer = persistReducer(modelPersistConfig, modelReducer);

const store = configureStore({
    reducer: {
        message: persistedMessageReducer,
        chat: persistedChatReducer,
        user: persistedUserReducer,
        userData: persistedUserDataReducer,
        dark: persistedDarkModeReducer,
        model: persistedModelReducer
    },
});

export const persistor = persistStore(store);
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
