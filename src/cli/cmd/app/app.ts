import { treeSubService } from "../service/tree-sub-service.js";
import { moduleRegistryList , ModuleRegistryList , ModuleRegistryTree, ModuleCommands } from "../data/command-index.js";
import { conversionAssembled } from "../service/conversion-assembled.js";
import { AssembledApp } from "../types/app-type.js";
import { createAppService } from "./app-services.js";
import { CommandsTable } from "../types/command-type.js";

type ServiceCommands = ReturnType<typeof createAppService>["command"] extends CommandsTable<infer T>
    ? T & ModuleCommands
    : ModuleCommands;

type AppCommandTable = CommandsTable<ServiceCommands>;


export class CommandSelectionSystem {
    private moduleRegistryList: ModuleRegistryList = moduleRegistryList;
    private moduleRegistryTree!: ModuleRegistryTree;
    private assembledApp!: AssembledApp;
    private appServiceRegistry!: ReturnType<typeof createAppService>;
    private commands!: AppCommandTable;

    constructor() {
        this.initApp();
    }

    private initApp() {
        this.moduleRegistryTree = treeSubService(this.moduleRegistryList);
        this.assembledApp = conversionAssembled(this.moduleRegistryTree);
        this.appServiceRegistry = createAppService(this.assembledApp);

        this.commands = {
            ...this.assembledApp.commands,
            ...this.appServiceRegistry.command,
        };
    }

    run<Key extends keyof ServiceCommands>(command: {
        cmd: Key;
        arg: ServiceCommands[Key];
    }) {
        return this.commands[command.cmd](command.arg);
    }
}
