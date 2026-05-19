import { type OutEventBusMap } from "../types/out.event-bus.type.js";
import { type  EventBus } from "../util/event-bus.js";
import { logger } from "../util/logger.js";


export class ServerLogger{
    #eventBus!:EventBus<OutEventBusMap>;
    constructor(eventBus:EventBus<OutEventBusMap>){
        this.#eventBus = eventBus;
    }
    logger<K extends keyof typeof logger >(type:K,message:string):ReturnType<(typeof logger)[K]>{
        this.#eventBus.emit("log",{
            message,
            type
        });

        return logger[type](message) as ReturnType<(typeof logger)[K]>;
    }
}