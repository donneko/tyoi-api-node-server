export const ERROR_CODE_2XX = [
    {
        code:200,
        message:"OK",
        description: "The request is OK (this is the standard response for successful HTTP requests).",
        label:"http"

    },
    {
        code:201,
        message:"Created",
        description: "The request has been fulfilled, and a new resource is created.",
        label:"http"

    },
    {
        code:202,
        message:"Accepted",
        description: "The request has been accepted for processing, but the processing has not been completed. The request might or might not eventually be acted upon, and may be disallowed when processing occurs.",
        label:"http"
    },
    {
        code: 203,
        message: "Non-Authoritative Information",
        description: "The request has been successfully processed, but is returning information that may be from another source.",
        label:"http"

    },
    {
        code: 204,
        message: "No Content",
        description: "The request has been successfully processed, but is not returning any content.",
        label:"http"

    },
    {
        code: 205,
        message: "Reset Content",
        description: "The request has been successfully processed, but is not returning any content, and requires that the requester reset the document view.",
        label:"http"
    },
    {
        code: 206,
        message: "Partial Content",
        description: "The server is delivering only part of the resource due to a range header sent by the client.",
        label:"http"
    },
    {
        code: 207,
        message: "Multi-Status",
        description: "The message body that follows is by default an XML message and can contain a number of separate response codes, depending on how many sub-requests were made.",
        label:"http"
    },
    {
        code: 208,
        message: "Already Reported",
        description: "The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response, and are not being included again.",
        label:"http"
    },
    {
        code: 218,
        message: "This is fine (Apache Web Server)",
        description: "Used as a catch-all error condition for allowing response bodies to flow through Apache when ProxyErrorOverride is enabled.",
        label:"http"
    },
    {
        code: 226,
        message: "IM Used",
        description: "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.",
        label:"http"
    },
] as const;