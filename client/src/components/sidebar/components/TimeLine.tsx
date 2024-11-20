import { clearMessagesList } from "@/features/messageSlice"
import { Timeline } from "@/types/types"
import { useChat } from "@/utils/useChat"
import { Archive } from "lucide-react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

type Props = {
  timeline: Timeline
}

export default function TimeLine({ timeline }: Props) {
  const dispatch = useDispatch();
  const { handleDeleteChat } = useChat()
  return (
    <div className="w-full flex flex-col">
      <p className="text-sm text-gray-500 font-bold p-2  ">{timeline.label}</p>
      {
        timeline.timelines.map((item, index) => (
          <Link to={`/chat/${item.id}`} onClick={() => { dispatch(clearMessagesList()) }} key={index} className="p-2 group hover:bg-slate-800 group-hover:text-white ease-in-out duration-100 rounded-lg transition-all items-center text-sm w-full flex justify-between">
            <div className="text-ellipsis overflow-hidden w-[80%] whitespace-nowrap group-hover:text-white">
              {item.title}
            </div>
            <div className="hidden group-hover:text-gray-300 group-hover:flex transition-all items-center gap-2 ease-in-out duration-100">
              {/* <Ellipsis size={20} /> */}
              <Archive onClick={() => { handleDeleteChat(item.id) }} size={20} />
            </div>
          </Link>
        ))
      }
    </div>
  )
}