import type { LoggerCreateData } from "../util/logger.js";

export type OutEventBusMap = {
    "server/*:log": LoggerCreateData | void
}