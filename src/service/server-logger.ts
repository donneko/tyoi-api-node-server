import { type InnerEventBusMap } from "../types/inner.event-bus.type.js";
import { type OutEventBusMap } from "../types/out.event-bus.type.js";
import { type EventBus } from "../util/event-bus.js";
import { logger } from "../util/logger.js";

export class ServerLogger {
    #innerEventBus!: EventBus<InnerEventBusMap>;
    #outEventBus!: EventBus<OutEventBusMap>;
    constructor(eventBus: EventBus<InnerEventBusMap>, outBus: EventBus<OutEventBusMap>) {
        this.#innerEventBus = eventBus;
        this.#outEventBus = outBus;
    }
    logger<K extends keyof typeof logger>(
        type: K,
        ...args: Parameters<(typeof logger)[K]>
    ): ReturnType<(typeof logger)[K]> {
        const fn = logger[type] as (
            ...args: Parameters<(typeof logger)[K]>
        ) => ReturnType<(typeof logger)[K]>;

        const data = fn.call(logger, ...args);
        this.#innerEventBus.emit("server/*:log", data);
        this.#outEventBus.emit("server/*:log", data);
        return data;
    }
}
