import type { ServerStartOptions, ServerStartUseConfig } from "../../../types/server.type.js";
import type { ServerCreateServerConfigDependencies } from "../../../types/server-dependencies.type.js";
import { findAvailablePort } from "./find-available-port.js";

export async function createServerConfig(
    options: ServerStartOptions = {},
    dependencies: ServerCreateServerConfigDependencies
): Promise<ServerStartUseConfig> {
    if (options) {
        dependencies.serverConfig.updateConfig(options);
    }
    const exposeLan = dependencies.serverConfig.getConfig("exposeLan");
    const autoPort = dependencies.serverConfig.getConfig("autoPort");
    const showQrCode = dependencies.serverConfig.getConfig("showQrCode");
    const publicPath = dependencies.serverConfig.getConfig("publicDirname");
    const openBrowser = dependencies.serverConfig.getConfig("openBrowser");
    const apiPrefix = dependencies.serverConfig.getConfig("apiPrefix");
    const configPort = dependencies.serverConfig.getConfig("port");
    const publicFullPath = dependencies.serverRegister.getConfig("publicDirectoryPath") ?? "";

    // ホスト設定
    const host = exposeLan ? "0.0.0.0" : "127.0.0.1";

    // ポート設定
    const port = await findAvailablePort(
        {
            startPort: configPort,
            host,
            isAutoPort: autoPort,
        },
        dependencies
    );

    return {
        port,
        exposeLan,
        showQrCode,
        publicPath,
        publicFullPath,
        openBrowser,
        apiPrefix,
        host,
    };
}
