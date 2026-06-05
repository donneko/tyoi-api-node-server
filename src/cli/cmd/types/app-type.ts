import { ModuleCommands, ModuleRegistryItem } from "../data/command-index.js";
import { CommandsTable } from "./command-type.js";

export type AppContext = {
    [Item in ModuleRegistryItem as Item["namespace"]]: Item["context"];
};

export type AppServices = {
    [Item in ModuleRegistryItem as Item["namespace"]]: Item["service"];
};

export type AssembledApp = {
    appContext: AppContext;
    services: AppServices;
    commands: CommandsTable<ModuleCommands>;
};
