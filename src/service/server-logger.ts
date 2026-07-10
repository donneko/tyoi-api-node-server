import { Logger } from "@donneko/tyoi-logger";

import { type InnerEventBusMap } from "../types/inner.event-bus.type.js";
import { type OutEventBusMap } from "../types/out.event-bus.type.js";
import { type EventBus } from "../util/event-bus.js";

const logger = new Logger();
type LoggerMethodName = {
    [K in keyof Logger]: Logger[K] extends (...args: never[]) => unknown ? K : never;
}[keyof Logger];

export class ServerLogger {
    #innerEventBus!: EventBus<InnerEventBusMap>;
    #outEventBus!: EventBus<OutEventBusMap>;
    constructor(eventBus: EventBus<InnerEventBusMap>, outBus: EventBus<OutEventBusMap>) {
        this.#innerEventBus = eventBus;
        this.#outEventBus = outBus;
    }
    logger<K extends LoggerMethodName>(
        type: K,
        ...args: Parameters<Logger[K]>
    ): ReturnType<Logger[K]> {
        const fn = logger[type] as (...args: Parameters<Logger[K]>) => ReturnType<Logger[K]>;

        const data = fn.call(logger, ...args);
        this.#innerEventBus.emit("server/*:log", data);
        this.#outEventBus.emit("server/*:log", data);
        return data;
    }
}
