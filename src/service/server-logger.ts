import { type InnerEventBusMap } from "../types/inner.event-bus.type.js";
import { type  EventBus } from "../util/event-bus.js";
import { logger } from "../util/logger.js";


export class ServerLogger{
    #eventBus!:EventBus<InnerEventBusMap>;
    constructor(eventBus:EventBus<InnerEventBusMap>){
        this.#eventBus = eventBus;
    }
    logger<K extends keyof typeof logger >(
        type:K,
        ...args:Parameters<(typeof logger)[K]>
    ):ReturnType<(typeof logger)[K]>{
        const fn = logger[type] as
            (...args:Parameters<(typeof logger)[K]>)
            => ReturnType<(typeof logger)[K]>;

        const data = fn(...args);
        this.#eventBus.emit("server/*:log",data);
        return data;
    }
}