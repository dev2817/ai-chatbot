import AiMessage from "@/components/aimessage/AiMessage";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ChatFooter from "./components/ChatFooter";
import { useChat } from "@/utils/useChat";
import { useSelector } from "react-redux";
import { selectMessages } from "@/features/messageSlice";
import ChatHeader from "./components/ChatHeader";

type Props = {};

export default function ChatPage({ }: Props) {
    const { id } = useParams();
    const { setChatId, userId } = useChat();
    const messages = useSelector(selectMessages);
    const endRef = useRef<HTMLDivElement | null>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const { joinRoom } = useChat();
    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        setChatId(id || "");
    }, [id]);

    useEffect(() => {
        joinRoom(id as string);
    }, [id, joinRoom]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop > clientHeight + 100) {
            setShowScrollButton(true);
        } else {
            setShowScrollButton(false);
        }
    };

    return (
        <div className='h-full w-full p-4 relative'>
            <div className="h-full w-full flex flex-col justify-between pb-5">
                <ChatHeader />
                <main className="w-full h-full flex flex-col items-center justify-center">
                    <div className="flex flex-col flex-1 w-full items-center justify-center">
                        <div
                            onScroll={handleScroll}
                            className="flex flex-col gap-3 max-w-5xl w-full h-[calc(100vh-220px)] py-5 overflow-y-auto scrollbar-none"
                        >
                            {messages.length > 0 &&
                                messages.map((message, index) => (
                                    message.userId === userId ? (
                                        <div className="flex flex-col self-end text-end w-fit gap-3">
                                            {message?.image && <img src={message?.image} className="h-[170px] w-[170px] flex self-end mr-12 rounded-md" alt="message-image" />}
                                            <div key={index} className="p-5 rounded-xl max-w-[80%] flex self-end text-justify  w-fit text-white bg-slate-500">
                                                {message.message}
                                            </div>
                                        </div>
                                    ) : (
                                        <AiMessage
                                            key={index}
                                            className="p-5 rounded-xl text-justify max-w-[80%] self-start w-fit"
                                            delay={index === messages?.length - 1 ? 150 : 0}
                                            data={message.message}
                                        />
                                    )
                                ))}
                            <div ref={endRef} />
                        </div>
                    </div>
                </main>
                <section className="w-full max-h-3xl flex items-center flex-col gap-5">
                    <ChatFooter />
                </section>
            </div>
            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className="z-10 bottom-[8rem] absolute right-[1.5rem] p-3 rounded-full bg-slate-600 text-white shadow-lg hover:bg-slate-700 transition-all"
                >
                    <ChevronDown size={24} />
                </button>
            )}
        </div>
    );
}
