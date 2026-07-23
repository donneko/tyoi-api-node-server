import type { ServerCreateConfigDependencies } from "../../../types/server-dependencies.type.js";
import type { ServerCreateServerConfigReturn } from "../../../types/server.type.js";

export function createServerConfig(
    dependencies: ServerCreateConfigDependencies
): ServerCreateServerConfigReturn {
    const baseDirname = dependencies.serverConfig.getConfig("baseDirname");
    const publicDirname = dependencies.serverConfig.getConfig("publicDirname");
    const signalShutdownHandling = dependencies.serverConfig.getConfig("signalShutdownHandling");

    if (!baseDirname) throw new Error("baseDirname is required");

    return {
        baseDirname,
        publicDirname,
        signalShutdownHandling,
    };
}
