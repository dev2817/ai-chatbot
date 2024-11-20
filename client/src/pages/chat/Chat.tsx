import logo from '/logo.svg';
import ChatCards from "./components/ChatCards";
import ChatFooter from "./components/ChatFooter";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "@/utils/useChat";
import ChatHeader from "./components/ChatHeader";

const chatCardData = [
  {
    title: "Quick Brainstorm",
    description: "Generate creative ideas and solutions for your next project in seconds."
  },
  {
    title: "Daily Motivation",
    description: "Get a dose of positivity and inspiring quotes to start your day right."
  },
  {
    title: "Coding Assistant",
    description: "Find solutions to coding challenges and enhance your development process."
  },
  {
    title: "Language Practice",
    description: "Engage in conversational practice and improve your fluency in any language."
  },
];


export default function Chat() {
  const { id } = useParams();
  const { setChatId } = useChat();
  useEffect(() => {
    setChatId(id || "")
  }, [id])
  return (
    <div className='h-full w-full p-4'>
      <div className="h-full w-full flex flex-col justify-between pb-5">
        <ChatHeader />
        <main className="flex flex-col items-center text-center justify-center gap-4">
          <div className='h-10 w-10 bg-white p-1 rounded-full'>
            <img src={logo} alt="Logo" />
          </div>
          <p className="text-2xl font-semibold">How can I help you today?</p>
        </main>

        <section className="w-full max-h-3xl flex items-center flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 mx-auto">
            {
              chatCardData.map((data, index) => (
                <ChatCards data={data} key={index} />
              ))
            }
          </div>
          <ChatFooter />
        </section>
      </div>
    </div>
  )
}
