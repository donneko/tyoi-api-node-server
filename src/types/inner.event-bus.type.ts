import type { LoggerCreateData } from "../util/logger.js";

export type InnerEventBusMap = {
    "server/*:log": LoggerCreateData | void,
    "server/start:error":{
        error?:Error
    },
    "server/start:success":{
    },
    "server/start:process":{
    },
    "server/stop:error":{
    },
    "server/stop:timeout":{
    },
    "server/stop:success":{
    },
    "server/stop:process":{
    }
}