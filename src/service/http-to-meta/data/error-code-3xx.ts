export const ERROR_CODE_3XX = [
    {
        code: 300,
        message: "Multiple Choices",
        description: "A link list. The user can select a link and go to that location. Maximum five addresses.",
        label:"http"
    },
    {
        code: 301,
        message: "Moved Permanently",
        description: "The requested page has moved to a new URL.",
        label:"http"
    },
    {
        code: 302,
        message: "Found",
        description: "The requested page has moved temporarily to a new URL.",
        label:"http"
    },
    {
        code: 303,
        message: "See Other",
        description: "The requested page can be found under a different URL.",
        label:"http"
    },
    {
        code: 304,
        message: "Not Modified",
        description: "Indicates the requested page has not been modified since last requested.",
        label:"http"
    },
    {
        code: 306,
        message: "Switch Proxy",
        description: "No longer used. Originally meant \"Subsequent requests should use the specified proxy.\"",
        label:"http"
    },
    {
        code: 307,
        message: "Temporary Redirect",
        description: "The requested page has moved temporarily to a new URL.",
        label:"http"

    },
    {
        code: 308,
        message: "Resume Incomplete",
        description: "Used in the resumable requests proposal to resume aborted PUT or POST requests.",
        label:"http"
    },
] as const;
