import { acceptString } from "@/utils/constants";
import { useChat } from "@/utils/useChat";
import { ArrowUp, Paperclip } from "lucide-react";

type Props = {}

export default function ChatFooter({ }: Props) {
    const { message, handleChange, handleFileChange, handleSubmit } = useChat()

    return (
        <div className="w-full max-w-5xl flex relative">
            <input
                placeholder="Message Gemini..."
                type="text"
                name="text"
                value={message}
                onChange={(e) => {
                    handleChange(e)
                }}
                className="w-full h-14 px-14 bg-inherit rounded-xl border border-gray-500 " />
            <div className="absolute right-2 top-1">
                <button onClick={() => { handleSubmit() }} className="text-white hover:opacity-80 my-1 bg-slate-500  w-fit rounded-xl p-3 ">
                    <ArrowUp size={18} />
                </button>
            </div>
            <div className="absolute left-2 top-1">
                <label>
                    <input
                        type="file"
                        name="file"
                        multiple={false}
                        className="hidden"
                        accept={acceptString}
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            handleFileChange(file);
                        }}
                    />
                    <div className="text-white hover:opacity-80 my-1 bg-slate-500 w-fit rounded-xl p-3">
                        <Paperclip size={18} />
                    </div>
                </label>
            </div>
        </div>
    )
}