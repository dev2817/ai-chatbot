import axios from "axios"
import { CheckUserData, CompleteProfileInput, GoogleSignData, UserForgotPassword, UserOtpVerify, UserResendOtp, UserResetPassword, UserSignInData, UserSignUpData } from "../pages/auth/types";

const baseUrl = import.meta.env.VITE_AUTH_BACKEND_URL;
const chatBaseUrl = import.meta.env.VITE_BACKEND_URL;

export const authApi = {
    signUp: async (data: UserSignUpData) => {
        return await axios.post(`${baseUrl}/signUp`, data);
    },
    signIn: async (data: UserSignInData) => {
        return await axios.post(`${baseUrl}/signIn`, data)
    },
    verifyOtp: async (data: UserOtpVerify) => {
        return await axios.post(`${baseUrl}/otpVerify`, data)
    },
    resentOtp: async (data: UserResendOtp) => {
        return await axios.post(`${baseUrl}/resendOtp`, data)
    },
    forgotPassword: async (data: UserForgotPassword) => {
        return await axios.post(`${baseUrl}/forgotPassword`, data)
    },
    resetPassword: async (data: UserResetPassword) => {
        return await axios.post(`${baseUrl}/resetPassword`, data)
    },
    checkUserData: async (data: CheckUserData) => {
        return await axios.post(`${baseUrl}/checkUserData`, data)
    },
    signWithGoogle: async (data: GoogleSignData) => {
        return await axios.post(`${baseUrl}/signWithGoogle`, data);
    },
    completeProfile: async (data: CompleteProfileInput) => {
        return await axios.post(`${baseUrl}/completeProfile`, data);
    },
    checkToken: async () => {
        return await axios.get(`${baseUrl}/checkToken`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authtoken')}`
            }
        })
    },
    getUserById: async (userId: string) => {
        return await axios.get(`${baseUrl}/getUserById/${userId}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('authtoken')}`
            }
        })
    },
}

export const chatApi = {
    promptAi: async (data: any) => {
        return await axios.post(`${chatBaseUrl}/prompt`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("authtoken")}`
            }
        })
    },
    getChatMessages: async (chatId: string) => {
        return await axios.get(`${chatBaseUrl}/get-messages/${chatId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authtoken")}`
            }
        })
    },
    getChats: async (userId: string) => {
        return await axios.get(`${chatBaseUrl}/get-chats/${userId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authtoken")}`
            }
        })
    },
    deleteChats: async (data: { userId: string, chatId: string }) => {
        return await axios.put(`${chatBaseUrl}/delete-chat`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authtoken")}`
            }
        })
    },
}