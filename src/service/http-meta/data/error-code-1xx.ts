export const ERROR_CODE_1XX = [
    {
        code: 100,
        message: "Continue",
        description: "The server has received the request headers, and the client should proceed to send the request body.",
        label:"http"
    },
    {
        code: 101,
        message: "Switching Protocols",
        description: "The requester has asked the server to switch protocols.",
        label:"http"
    },
    {
        code:102,
        message: "Processing",
        description: "This code indicates that the server has received and is processing the request, but no response is available yet. This prevents the client from timing out and assuming the request was lost.",
        label:"http"
    },
    {
        code:103,
        message: "Early Hints",
        description: "Used to return some response headers before final HTTP message.",
        label:"http"
    }
] as const;