import TimeLine from './components/TimeLine';
import logo from '/logo.svg';
import { ChevronLeft, ChevronRight, Ellipsis, FilePenLine } from 'lucide-react'
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearMessagesList } from '@/features/messageSlice';
import { clearChatList, selectChats } from '@/features/chatSlice';
import { clearUserData, selectUserData } from '@/features/userDataSlice';
import defaultProfile from '/defaultProfile.png'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { clearUserId } from '@/features/userSlice';
import { persistor } from '@/store/store';

export default function SideBar() {
  const [openSideBar, setOpenSideBar] = useState(true);
  const chatList = useSelector(selectChats)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector(selectUserData);
  const handleToggleSideBar = () => {
    setOpenSideBar(!openSideBar);
  }
  const handleLogOut = async () => {
    dispatch(clearUserId());
    dispatch(clearUserData());
    dispatch(clearMessagesList());
    dispatch(clearChatList());
    localStorage.clear();
    persistor.purge();
    navigate('/auth/sign-in')
    return;
  }
  return (
    <div className={cn('min-h-screen relative w-full max-w-[244px] transition-all',
      {
        'translate-x-0 duration-500': openSideBar,
        'w-0 -translate-x-full duration-500': !openSideBar
      })}>
      {
        openSideBar &&
        <div className={cn("h-full pl-4 pr-6 pt-20 w-full w-max-[244px] dark:bg-[#0D0D0D] relative")}>
          <div className='absolute top-5 left-0 pl-4 pr-6 w-full'>
            <button onClick={() => { dispatch(clearMessagesList()); navigate('/chat') }} className='flex justify-between w-full items-center p-2 hover:text-white hover:bg-slate-500/80 rounded-lg transition-all'>
              <section className='flex items-center gap-2'>
                <div className='h-8 w-8 bg-white p-1 rounded-full'>
                  <img src={logo} alt="Logo" />
                </div>
                <p className='text-sm'>
                  New Chat
                </p>
              </section>
              <FilePenLine className='text-white text-sm' size={22} />
            </button>
          </div>
          <div
            className="h-[calc(100vh-150px)] overflow-y-auto flex flex-col gap-5 scrollbar-none ">
            {chatList.map((timeline, index) => (
              <TimeLine timeline={timeline} key={index} />
            ))}
          </div>
          <div className="w-full">
            <Popover>
              <PopoverTrigger className='w-full'>
                <div className='w-full flex justify-between hover:bg-slate-500/80 rounded-lg transition-all p-2'>
                  <div className='flex justify-start gap-3 items-center'>
                    <img className='h-[40px] w-[40px] rounded-full' src={userData.profileImage ? userData.profileImage : defaultProfile} alt="" />
                    {userData.name}
                  </div>
                  <div className='flex justify-center items-center'>
                    <Ellipsis size={20} />
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[100px] flex flex-col items-center px-2">
                <h2 className='cursor-pointer' onClick={() => handleLogOut()}>
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      }
      <div className='absolute h-full inset-y-0 right-[-30px]'>
        <div className='flex items-center h-full w-[30px] justify-center'>
          <button onClick={() => { handleToggleSideBar() }} className='h-[100px] w-full group flex items-center justify-center text-gray-500 hover:text-white transition-all'>
            <ChevronLeft className={cn('hidden transition-all', { "group-hover:flex": openSideBar })} size={36} />
            <div className={('text-xl group-hover:hidden transition-all')}>
              |
            </div>
            <ChevronRight className={cn('hidden transition-all', { "group-hover:flex": !openSideBar })} size={36} />
          </button>
        </div>
      </div>
    </div>
  )
}
