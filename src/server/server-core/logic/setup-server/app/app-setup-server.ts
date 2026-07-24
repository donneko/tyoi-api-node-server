import { setupPublicPath } from "../service/setup-public-path.js";
import { createServerConfig } from "../service/create-server-config.js";
import { setupSignalStop } from "../service/setup-signal-stop.js";
import type { ServerSetupServerDependencies } from "../../../types/server-dependencies.type.js";

export function setupServer(dependencies: ServerSetupServerDependencies) {
    const serverConfig = createServerConfig(dependencies);

    setupPublicPath(serverConfig.baseDirname, serverConfig.publicDirname, dependencies);
    setupSignalStop(serverConfig.signalShutdownHandling, dependencies);
}
