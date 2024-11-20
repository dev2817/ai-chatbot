import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { selectDarkMode } from "@/features/darkModeSlice"
import { selectModel } from "@/features/modelSlice"
import { cn } from "@/utils/cn"
import { models } from "@/utils/constants"
import { useChat } from "@/utils/useChat"
import { ChevronDown, Moon, Sun } from "lucide-react"
import { useSelector } from "react-redux"

type Props = {}

export default function ChatHeader({ }: Props) {
    const selectedModel = useSelector(selectModel);
    const darkMode = useSelector(selectDarkMode);
    const { handleChangeModel, toggleDarkMode } = useChat();

    return (
        <nav className="flex justify-between">
            <Popover>
                <PopoverTrigger>
                    <button className="text-xl font-semibold flex gap-2 items-center hover:text-white hover:bg-slate-800 transition-all rounded-xl p-2 justify-center">
                        <p className="hover:text-white">{selectedModel.label}</p>
                        <ChevronDown size={20} className="mt-2 text-gray-500 font-bold" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[170px] flex flex-col px-4 gap-2"
                >
                    {
                        models.map((model) => (
                            <h2 className='cursor-pointer' key={model.label} onClick={() => { handleChangeModel(model.label) }}>
                                {model.label}
                            </h2>
                        ))
                    }
                </PopoverContent>
            </Popover>
            <button
                className="relative w-fit h-fit flex items-center transition-all duration-700"
                onClick={toggleDarkMode}
            >
                <Sun
                    size={34}
                    className={cn(
                        "absolute top-0 right-3 text-orange-400 transition-transform duration-700",
                        darkMode ? "rotate-180 opacity-0" : "rotate-0 opacity-100"
                    )}
                />
                <Moon
                    size={34}
                    className={cn(
                        "absolute top-0 right-3 text-white transition-transform duration-700",
                        darkMode ? "rotate-0 opacity-100" : "rotate-180 opacity-0"
                    )}
                />
            </button>
        </nav>
    )
}