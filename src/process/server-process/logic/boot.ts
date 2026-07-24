import { Server } from "../../../server/index.js";
import type { ServerOptions } from "../../../server/index.js";
import type { MainMessage } from "../../types/process.type.js";

type BootMessage = Extract<MainMessage, { type: "boot" }>;

export default async function serverBoot(message: BootMessage): Promise<Server> {
    const { path, option } = message.data;
    const useConfig = path ? await import(path).then((r) => r.default) : {};

    const server = new Server({
        ...useConfig,
        ...option,
        signalShutdownHandling: false,
    } as ServerOptions);

    return server;
}
