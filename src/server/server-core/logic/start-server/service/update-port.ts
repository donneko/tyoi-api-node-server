import { ServerUpdatePortDependencies } from "../../../types/server-dependencies.type.js";
import http from "node:http";

export function updatePort(
    port: number,
    httpServer: http.Server,
    dependencies: ServerUpdatePortDependencies
) {
    const address = httpServer.address();
    const newPort = typeof address === "object" && address !== null ? address.port : port;
    dependencies.serverConfig.updateConfig({ port: newPort });
}
