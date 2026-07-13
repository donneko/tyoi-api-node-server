import type { Logger } from "@donneko/tyoi-logger";

export type LoggerCreateData = ReturnType<Logger["createInfo"]>;

export type OutEventBusMap = {
    "server/*:log": LoggerCreateData | void;
};
