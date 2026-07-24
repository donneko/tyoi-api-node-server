import type { ServerSetupSignalStopDependencies } from "../../../types/server-dependencies.type.js";

export function setupSignalStop(
    signalShutdownHandling: boolean,
    dependencies: ServerSetupSignalStopDependencies
) {
    if (signalShutdownHandling) {
        process.on("SIGINT", dependencies.stop);
        process.on("SIGTERM", dependencies.stop);
    }
}
