import type http from "node:http";
import type { ServerCreateFinishDependencies } from "../../../types/server-dependencies.type.js";

export function createFinish(
    httpServer: http.Server,
    resolve: () => void,
    dependencies: ServerCreateFinishDependencies
) {
    const serverLogger = dependencies.serverLogger;
    const systemMetaManager = dependencies.systemMetaManager;
    const getMessage = (code: Parameters<typeof systemMetaManager.getMeta>[0]) =>
        systemMetaManager.getMeta(code).message;

    const finish = () => {
        if (finishObj.settled) return;
        finishObj.settled = true;

        clearTimeout(timeout);
        resolve();
    };

    const timeout = setTimeout(() => {
        if (finishObj.settled) return;

        httpServer.closeAllConnections();
        serverLogger.logger("warn", getMessage(105));

        finish();
    }, 10000);

    // オブジェクト内に settled を定義すると timeout と finish などに共有できる
    const finishObj = { finish, settled: false };

    return finishObj;
}
