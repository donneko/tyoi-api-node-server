import { createServerConfig } from "../service/create-server-config.js";
import type { ServerStartOptions } from "../../../types/server.type.js";
import type { ServerStartServerDependencies } from "../../../types/server-dependencies.type.js";
import http from "node:http";
import { createHttpServer } from "./app-create-http-server.js";
import { updatePort } from "../service/update-port.js";
import { serverPostStartup } from "./app-server-post-startup.js";
import { startCatchError } from "../service/start-catch-error.js";

export async function startServer(
    options: ServerStartOptions = {},
    dependencies: ServerStartServerDependencies
): Promise<http.Server> {
    try {
        const serverConfig = await createServerConfig(options, dependencies);

        // サーバー起動処理
        const httpServer = await createHttpServer(
            serverConfig.port,
            serverConfig.host,
            dependencies
        );

        // config の port 実際の httpServer のに書き換える。
        updatePort(serverConfig.port, httpServer, dependencies);

        serverPostStartup(serverConfig, dependencies);

        return httpServer;
    } catch (error) {
        startCatchError(error, dependencies);
    }
}
