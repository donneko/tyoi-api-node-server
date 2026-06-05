import { AssembledApp, AppContext, AppServices } from "../types/app-type.js";
import { CommandsTable } from "../types/command-type.js";

class AppService {
    appContext: AppContext;
    services: AppServices;
    name: string;

    constructor(ctx: AppContext, services: AppServices) {
        this.appContext = ctx;
        this.services = services;
        this.name = this.constructor.name;
    }

    hello() {
        console.log("hello");
        console.log(this.name, this.appContext, this.services);
    }
}

export type AppCommandsMap = {
    "TEST/app/hello" : null;
}

export function createAppService(assembledApp: AssembledApp) {
    const appService = new AppService(assembledApp.appContext, assembledApp.services);

    const namespace = "TEST/app";

    const command: CommandsTable<AppCommandsMap> = {
        "TEST/app/hello": (_arg) => appService.hello(),
    };

    return {
        command,
        namespace,
    };
}
