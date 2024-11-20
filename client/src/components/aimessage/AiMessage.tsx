import { useEffect, useState } from 'react'

export default function AiMessage({ className, delay, data }: { className: string, delay: number, data: any }) {
    const [resultData, setResultData] = useState("")
    const [prompt, setPrompt] = useState("");

    const formatResponse = (data: any) => {
        const doubleStar = data?.split("**");
        let newResponse = "";

        for (let i = 0; i < doubleStar?.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += doubleStar[i];
            } else {
                newResponse += `<div class="boldDiv">${doubleStar[i]}</div>`;
            }
        }

        const newResponse2 = newResponse?.split("*")?.join("");

        const newResponse3 = newResponse2?.split("```")?.map((part, index) => {
            if (index % 2 === 1) {
                return `
          <div class="codeDiv">

            <pre>${part}</pre>
          </div>`;
            }
            return part;
        }).join("");

        const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;
        const finalResponse = newResponse3.replace(linkRegex, (match, text, url) => {
            return `<a href="${url}" class="promptLink" target="_blank">${text}</a>`;
        });

        setPrompt(finalResponse);
    };


    const delayPara = (index: number, nextWord: any) => {
        setTimeout(() => {
            setResultData(prev => prev + nextWord)
        }, delay * index)
    }

    useEffect(() => {
        if (prompt) {
            const responseArray = prompt?.split(" ")
            for (let i = 0; i < responseArray?.length; i++) {
                delayPara(i, responseArray[i] + " ")
            }
        }
    }, [prompt])

    useEffect(() => {
        formatResponse(data)
    }, [])
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: resultData }}>
        </div>
    )
}
