import { ChatCard } from "@/types/types"
import { useChat } from "@/utils/useChat"

type Props = {
  data: ChatCard
}

export default function ChatCards({ data }: Props) {
  const { setMessage } = useChat();

  return (
    <button onClick={() => { setMessage(data.description) }} className="w-full group group-hover:text-white hover:bg-gray-700 transition-all flex flex-col p-2 gap-1 text-sm font-semibold border border-gray-500 rounded-xl">
      <h2 className="text-ellipsis group-hover:text-white overflow-hidden whitespace-nowrap w-[90%] flex justify-start">{data.title}</h2>
      <p className="text-gray-500 group-hover:text-gray-300 text-ellipsis overflow-hidden whitespace-nowrap w-[90%]">{data.description}</p>
    </button>
  )
}