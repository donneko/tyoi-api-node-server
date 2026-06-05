import { AssembledApp } from "../types/app-type.js";
import { ModuleRegistryTree } from "../data/command-index.js";

export function conversionAssembled(moduleRegistry: ModuleRegistryTree): AssembledApp {
    const appContext = {} as AssembledApp["appContext"];
    const services = {} as AssembledApp["services"];
    const commands = {} as AssembledApp["commands"];

    for (const [namespace, moduleItem] of Object.entries(moduleRegistry)) {
        Object.assign(appContext, { [namespace]: moduleItem.context });
        Object.assign(services, { [namespace]: moduleItem.service });
        Object.assign(commands, moduleItem.command);
    }

    return {
        appContext,
        services,
        commands,
    };
}