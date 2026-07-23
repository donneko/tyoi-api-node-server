import open from "open";
import { createNetworkData } from "./create-network-data.js";
import { ServerOpenBrowserArgs } from "../../../types/server.type.js";
import { ServerOpenBrowserDependencies } from "../../../types/server-dependencies.type.js";

export async function openBrowser(
    openBrowserData: ServerOpenBrowserArgs,
    dependencies: ServerOpenBrowserDependencies
): Promise<void> {
    const { host, port, target } = openBrowserData;

    if (!target) return;

    const serverLogger = dependencies.serverLogger;
    const systemMetaManager = dependencies.systemMetaManager;

    const { isLAN, networkUrl } = createNetworkData(port, host);

    if (!isLAN && target === "network")
        serverLogger.logger("warn", systemMetaManager.getMeta(112).message);

    const targetUrl = isLAN && target === "network" ? networkUrl : `http://localhost:${port}`;

    await open(targetUrl);
}
