import { AskPermission } from "../util/ask-permission.js";
import { isPortUsed } from "../util/is-port-used.js";
import type { ServerStartFindPortArgs } from "../../../types/server.type.js";
import type { ServerAvailablePortDependencies } from "../../../types/server-dependencies.type.js";

export async function findAvailablePort(
    findPortArgs: ServerStartFindPortArgs,
    dependencies: ServerAvailablePortDependencies
) {
    const { startPort, host, isAutoPort } = findPortArgs;

    const serverLogger = dependencies.serverLogger;
    const systemMetaManager = dependencies.systemMetaManager;
    const getMessage = (code: Parameters<typeof systemMetaManager.getMeta>[0], port: number) =>
        systemMetaManager.getMeta(code).message.replace("__PORT__", port.toString());
    let port = startPort;

    // ポートが使用されていたら、別のポートへ
    while (await isPortUsed(port, host)) {
        if (isAutoPort) {
            port++;
            continue;
        }

        serverLogger.logger("bar");
        serverLogger.logger("warn", getMessage(108, port));

        const pass = await AskPermission(
            serverLogger.logger("createSystem", getMessage(109, port + 1)).createMessage
        );

        if (!pass) {
            //許可されなかったら、例外
            throw new Error(
                systemMetaManager.getMeta(110).message.replace("__PORT__", port.toString())
            );
        }

        port++;
        serverLogger.logger("info", getMessage(111, port));
    }

    return port;
}
