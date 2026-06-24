export const ERROR_CODE_4XX = [
    {
        code: 400,
        message: "Bad Request",
        description: "The request cannot be fulfilled due to bad syntax.",
        label: "http",
    },
    {
        code: 401,
        message: "Unauthorized",
        description:
            "The request was a legal request, but the server is refusing to respond to it. For use when authentication is possible but has failed or not yet been provided.",
        label: "http",
    },
    {
        code: 402,
        message: "Payment Required",
        description: "Not yet implemented by RFC standards, but reserved for future use.",
        label: "http",
    },
    {
        code: 403,
        message: "Forbidden",
        description:
            "The request was a legal request, but the server is refusing to respond to it.",
        label: "http",
    },
    {
        code: 404,
        message: "Not Found",
        description:
            "The requested page could not be found but may be available again in the future.",
        label: "http",
    },
    {
        code: 405,
        message: "Method Not Allowed",
        description:
            "A request was made of a page using a request method not supported by that page.",
        label: "http",
    },
    {
        code: 406,
        message: "Not Acceptable",
        description: "The server can only generate a response that is not accepted by the client.",
        label: "http",
    },
    {
        code: 407,
        message: "Proxy Authentication Required",
        description: "The client must first authenticate itself with the proxy.",
        label: "http",
    },
    {
        code: 408,
        message: "Request Timeout",
        description: "The server timed out waiting for the request.",
        label: "http",
    },
    {
        code: 409,
        message: "Conflict",
        description: "The request could not be completed because of a conflict in the request.",
        label: "http",
    },
    {
        code: 410,
        message: "Gone",
        description: "The requested page is no longer available.",
        label: "http",
    },
    {
        code: 411,
        message: "Length Required",
        description:
            'The "Content-Length" is not defined. The server will not accept the request without it.',
        label: "http",
    },
    {
        code: 412,
        message: "Precondition Failed",
        description: "The precondition given in the request evaluated to false by the server.",
        label: "http",
    },
    {
        code: 413,
        message: "Request Entity Too Large",
        description:
            "The server will not accept the request, because the request entity is too large.",
        label: "http",
    },
    {
        code: 414,
        message: "Request-URI Too Long",
        description:
            "The server will not accept the request, because the URL is too long. Occurs when you convert a POST request to a GET request with a long query information.",
        label: "http",
    },
    {
        code: 415,
        message: "Unsupported Media Type",
        description:
            "The server will not accept the request, because the media type is not supported.",
        label: "http",
    },
    {
        code: 416,
        message: "Requested Range Not Satisfiable",
        description:
            "The client has asked for a portion of the file, but the server cannot supply that portion.",
        label: "http",
    },
    {
        code: 417,
        message: "Expectation Failed",
        description: "The server cannot meet the requirements of the Expect request-header field.",
        label: "http",
    },
    {
        code: 418,
        message: "I'm a teapot",
        description:
            'Any attempt to brew coffee with a teapot should result in the error code "418 I\'m a teapot". The resulting entity body MAY be short and stout.',
        label: "http",
    },
    {
        code: 419,
        message: "Page Expired (Laravel Framework)",
        description: "Used by the Laravel Framework when a CSRF Token is missing or expired.",
        label: "http",
    },
    {
        code: 420,
        message: "Method Failure (Spring Framework)",
        description: "A deprecated response used by the Spring Framework when a method has failed.",
        label: "http",
    },
    {
        code: 421,
        message: "Misdirected Request",
        description:
            "The request was directed at a server that is not able to produce a response (for example because a connection reuse).",
        label: "http",
    },
    {
        code: 422,
        message: "Unprocessable Entity",
        description:
            "The request was well-formed but was unable to be followed due to semantic errors.",
        label: "http",
    },
    {
        code: 423,
        message: "Locked",
        description: "The resource that is being accessed is locked.",
        label: "http",
    },
    {
        code: 424,
        message: "Failed Dependency",
        description: "The request failed due to failure of a previous request (e.g., a PROPPATCH).",
        label: "http",
    },
    {
        code: 426,
        message: "Upgrade Required",
        description:
            "The client should switch to a different protocol such as TLS 1.0, given in the Upgrade header field.",
        label: "http",
    },
    {
        code: 428,
        message: "Precondition Required",
        description: "The origin server requires the request to be conditional.",
        label: "http",
    },
    {
        code: 429,
        message: "Too Many Requests",
        description:
            "The user has sent too many requests in a given amount of time. Intended for use with rate limiting schemes.",
        label: "http",
    },
    {
        code: 431,
        message: "Request Header Fields Too Large",
        description:
            "The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.",
        label: "http",
    },
    {
        code: 440,
        message: "Login Time-out",
        description: "The client's session has expired and must log in again. (IIS)",
        label: "http",
    },
    {
        code: 444,
        message: "Connection Closed Without Response",
        description:
            "A non-standard status code used to instruct nginx to close the connection without sending a response to the client, most commonly used to deny malicious or malformed requests.",
        label: "http",
    },
    {
        code: 449,
        message: "Retry With",
        description:
            "The server cannot honour the request because the user has not provided the required information. (IIS)",
        label: "http",
    },
    {
        code: 450,
        message: "Blocked by Windows Parental Controls",
        description:
            "The Microsoft extension code indicated when Windows Parental Controls are turned on and are blocking access to the requested webpage.",
        label: "http",
    },
    {
        code: 451,
        message: "Unavailable For Legal Reasons",
        description:
            "A server operator has received a legal demand to deny access to a resource or to a set of resources that includes the requested resource.",
        label: "http",
    },
    {
        code: 494,
        message: "Request Header Too Large",
        description:
            "Used by nginx to indicate the client sent too large of a request or header line that is too long.",
        label: "http",
    },
    {
        code: 495,
        message: "SSL Certificate Error",
        description:
            "An expansion of the 400 Bad Request response code, used when the client has provided an invalid client certificate.",
        label: "http",
    },
    {
        code: 496,
        message: "SSL Certificate Required",
        description:
            "An expansion of the 400 Bad Request response code, used when a client certificate is required but not provided.",
        label: "http",
    },
    {
        code: 497,
        message: "HTTP Request Sent to HTTPS Port",
        description:
            "An expansion of the 400 Bad Request response code, used when the client has made a HTTP request to a port listening for HTTPS requests.",
        label: "http",
    },
    {
        code: 498,
        message: "Invalid Token (Esri)",
        description:
            "Returned by ArcGIS for Server. Code 498 indicates an expired or otherwise invalid token.",
        label: "http",
    },
    {
        code: 499,
        message: "Client Closed Request",
        description:
            "A non-standard status code introduced by nginx for the case when a client closes the connection while nginx is processing the request.",
        label: "http",
    },
] as const;
