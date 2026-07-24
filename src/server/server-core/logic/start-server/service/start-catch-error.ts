import type { ServerStartCatchErrorDependencies } from "../../../types/server-dependencies.type.js";

export function startCatchError(
    error: unknown,
    dependencies: ServerStartCatchErrorDependencies
): never {
    const serverLogger = dependencies.serverLogger;
    const systemMetaManager = dependencies.systemMetaManager;
    const innerEventBus = dependencies.innerEventBus;

    serverLogger.logger("error", systemMetaManager.getMeta(103).message);

    if (error instanceof Error) {
        serverLogger.logger("error", error.message);
        innerEventBus.emit("server/start:error", { error });
    } else {
        innerEventBus.emit("server/start:error", {});
    }

    throw error;
}
