import type { ServerCreateExpressConfigDependencies } from "../../../types/server-dependencies.type.js";
import type { ServerCreateExpressConfigReturn } from "../../../types/server.type.js";

export function createExpressConfig(
    dependencies: ServerCreateExpressConfigDependencies
): ServerCreateExpressConfigReturn {
    const middlewares = dependencies.serverConfig.getConfig("middlewares");
    const apiPrefix = dependencies.serverConfig.getConfig("apiPrefix");
    const publicDirectoryPath = dependencies.serverRegister.getConfig("publicDirectoryPath") ?? "";

    return { middlewares, apiPrefix, publicDirectoryPath };
}
