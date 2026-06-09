import  { logger, type LoggerCreateData } from "../../../../util/logger.js"


export function createCopyResult(
    {
        error,
        ok
    }:{
        error:string[]
        ok:string[]
    }
):{
    title:string,
    content:LoggerCreateData[]
}{

    return {
        title:"コピー結果",
        content:[
            ...error.map(m => logger.createError(m)),
            ...ok.map(m => logger.createSuccess(m))
        ]
    }
}