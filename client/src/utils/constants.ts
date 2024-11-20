export const models = [
    {
        model: "gemini-1.0-pro",
        label: "Gemini 1.0-pro"
    },
    {
        model: "gemini-1.5-flash",
        label: "Gemini 1.5-flash"
    },
    {
        model: "gemini-1.5-pro",
        label: "Gemini 1.5-pro"
    },
    {
        model: "gemini-1.5-flash-8b",
        label: "Gemini 1.5-flash-8b"
    },
]

export const supportedMimes = [
    "application/pdf",
    "application/x-javascript",
    "text/javascript",
    "application/x-python",
    "text/x-python",
    "text/plain",
    "text/html",
    "text/css",
    "text/md",
    "text/csv",
    "text/xml",
    "text/rtf",
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/heic",
    "image/heif",
    "audio/wav",
    "audio/mp3",
    "audio/aiff",
    "audio/aac",
    "audio/ogg",
    "audio/flac",
];

export const maxFileSize = 5 * 1024 * 1024;
export const acceptString = supportedMimes.join(","); 