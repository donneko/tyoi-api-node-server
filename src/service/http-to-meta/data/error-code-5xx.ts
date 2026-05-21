export const ERROR_CODE_5XX = [

    {
        code: 500,
        message: "Internal Server Error",
        description: "An error has occurred in a server side script, a no more specific message is suitable.",
        label:"http"
    },
    {
        code: 501,
        message: "Not Implemented",
        description: "The server either does not recognize the request method, or it lacks the ability to fulfill the request.",
        label:"http"
    },
    {
        code: 502,
        message: "Bad Gateway",
        description: "The server was acting as a gateway or proxy and received an invalid response from the upstream server.",
        label:"http"
    },
    {
        code: 503,
        message: "Service Unavailable",
        description: "The server is currently unavailable (overloaded or down).",
        label:"http"
    },
    {
        code: 504,
        message: "Gateway Timeout",
        description: "The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.",
        label:"http"
    },
    {
        code: 505,
        message: "HTTP Version Not Supported",
        description: "The server does not support the HTTP protocol version used in the request.",
        label:"http"
    },
    {
        code: 506,
        message: "Variant Also Negotiates",
        description: "Transparent content negotiation for the request results in a circular reference.",
        label:"http"
    },
    {
        code: 507,
        message: "Insufficient Storage",
        description: "The server is unable to store the representation needed to complete the request.",
        label:"http"
    },
    {
        code: 508,
        message: "Loop Detected",
        description: "The server detected an infinite loop while processing the request (sent instead of 208 Already Reported).",
        label:"http"
    },
    {
        code: 509,
        message: "Bandwidth Limit Exceeded",
        description: "The server has exceeded the bandwidth specified by the server administrator; this is often used by shared hosting providers to limit the bandwidth of customers.",
        label:"http"
    },
    {
        code: 510,
        message: "Not Extended",
        description: "Further extensions to the request are required for the server to fulfil it.",
        label:"http"
    },
    {
        code: 511,
        message: "Network Authentication Required",
        description: "The client needs to authenticate to gain network access.",
        label:"http"
    },
    {
        code: 520,
        message: "Unknown Error",
        description: "The 520 error is used as a \"catch-all response for when the origin server returns something unexpected\", listing connection resets, large headers, and empty or invalid responses as common triggers.",
        label:"http"
    },
    {
        code: 521,
        message: "Web Server Is Down",
        description: "The origin server has refused the connection from Cloudflare.",
        label:"http"
    },
    {
        code: 522,
        message: "Connection Timed Out",
        description: "Cloudflare could not negotiate a TCP handshake with the origin server.",
        label:"http"
    },
    {
        code: 523,
        message : "Origin Is Unreachable",
        description: "Cloudflare could not reach the origin server; for example, if the DNS records for the origin server are incorrect.",
        label:"http"
    },
    {
        code: 524,
        message: "A Timeout Occurred",
        description: "Cloudflare was able to complete a TCP connection to the origin server, but did not receive a timely HTTP response.",
        label:"http"
    },
    {
        code: 525,
        message: "SSL Handshake Failed",
        description: "Cloudflare could not negotiate a SSL/TLS handshake with the origin server.",
        label:"http"
    },
    {
        code: 526,
        message: "Invalid SSL Certificate",
        description: "Used by Cloudflare and Cloud Foundry's gorouter to indicate failure to validate the SSL/TLS certificate that the origin server presented.",
        label:"http"
    },
    {
        code: 527,
        message: "Railgun Listener to Origin Error",
        description: "Error 527 indicates that the request timed out or failed after the WAN connection had been established.",
        label:"http"
    },
    {
        code: 530,
        message: "Origin DNS Error",
        description: "Error 530 indicates that the requested host name could not be resolved on the Cloudflare network to an origin server.",
        label:"http"
    },
    {
        code: 598,
        message: "Network Read Timeout Error",
        description: "Used by some HTTP proxies to signal a network read timeout behind the proxy to a client in front of the proxy.",
        label:"http"
    }
] as const;
