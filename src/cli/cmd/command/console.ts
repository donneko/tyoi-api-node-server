import { CommandsTable } from "../types/command-type.js";

const INITIAL_CONSOLE_CONTEXT = {
    test: "console"
} as const;

export type ConsoleContext = typeof INITIAL_CONSOLE_CONTEXT;

export type ConsoleCommandsMap = {
    "console/log": unknown[] | unknown;
};

export class Console {
    context: ConsoleContext;
    name: string;

    constructor(ctx: ConsoleContext) {
        this.context = ctx;
        this.name = this.constructor.name;
    }

    log(data: unknown[] | unknown): void {
        console.log(data);
    }
}

export type ConsoleSubServiceExport = {
    namespace: "console";
    context: ConsoleContext;
    service: Console;
    command: CommandsTable<ConsoleCommandsMap>;
};

export function initSubServiceConsole(): ConsoleSubServiceExport {
    const service = new Console(INITIAL_CONSOLE_CONTEXT);

    const command: CommandsTable<ConsoleCommandsMap> = {
        "console/log": (data) => service.log(data),
    };

    return {
        namespace: "console",
        context: INITIAL_CONSOLE_CONTEXT,
        service,
        command,
    };
}