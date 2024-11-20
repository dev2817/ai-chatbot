import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import AuthLayout from '../pages/auth'
import SignIn from '../pages/auth/pages/SignIn'
import SignUp from '../pages/auth/pages/SignUp'
import ForgotPassword from '../pages/auth/pages/ForgotPassword'
import OtpVerify from '../pages/auth/pages/OtpVerify'
import ResetPassword from '../pages/auth/pages/ResetPassword'
import CompleteProfile from '../pages/auth/pages/CompleteProfile'
import ChatLayout from '../layouts/ChatLayout'
import Chat from '../pages/chat/Chat'
import ChatPage from '@/pages/chat/ChatPage'

export default function AppRoutes() {
    const router = createBrowserRouter([
        {
            path: "/",
            children: [
                {
                    index: true,
                    element: <Navigate to="auth" replace />
                },
                {
                    path: "/auth",
                    element: <AuthLayout />,
                    children: [
                        {
                            index: true,
                            element: <Navigate to="sign-in" replace />
                        },
                        {
                            path: "sign-in",
                            element: <SignIn />
                        },
                        {
                            path: "sign-up",
                            element: <SignUp />
                        },
                        {
                            path: "forgot-password",
                            element: <ForgotPassword />
                        },
                        {
                            path: "otp-verify",
                            element: <OtpVerify />
                        },
                        {
                            path: "reset-password",
                            element: <ResetPassword />
                        },
                        {
                            path: "complete-profile",
                            element: <CompleteProfile />
                        },
                    ]
                },
                {
                    path: "/chat",
                    element: <ChatLayout />,
                    children: [
                        {
                            path: "",
                            element: <Chat />
                        },
                        {
                            path: ":id",
                            element: <ChatPage />
                        }
                    ]
                }
            ]
        }
    ])
    return (
        <RouterProvider router={router} />
    )
}
