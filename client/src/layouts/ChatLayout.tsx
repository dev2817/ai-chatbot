import { Outlet, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'
import SideBar from '@/components/sidebar/SideBar'
import { ChatProvider } from '@/utils/ChatContext'
import { persistor } from '@/store/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '@/apis/authApis';
import { clearUserId } from '@/features/userSlice';
import { selectDarkMode } from '@/features/darkModeSlice';

export default function ChatLayout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const darkMode = useSelector(selectDarkMode);
    const verifyToken = async () => {
        const response = await authApi.checkToken()
        if (!response.data.success) {
            dispatch(clearUserId());
            localStorage.clear();
            persistor.purge();
            window.location.reload();
            navigate('/auth/sign-in')
            return;
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('authtoken')
        if (!token) {
            dispatch(clearUserId());
            localStorage.clear();
            persistor.purge();
            window.location.reload();
            navigate('/auth/sign-in')
            return;
        }
        verifyToken()
    }, [])
    return (
        <ChatProvider>
            <div className={darkMode ? "dark" : ""}>
                <div className={cn('min-h-screen overflow-hidden w-full dark:text-white dark:bg-[#161616] flex')}>
                    <SideBar />
                    <div className='min-h-screen w-full border-2'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </ChatProvider>
    )
}
