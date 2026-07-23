import http from "node:http";
import type { ServerCreateHttpServerDependencies } from "../../../types/server-dependencies.type.js";

export async function createHttpServer(
    port: number,
    host: string,
    dependencies: ServerCreateHttpServerDependencies
): Promise<http.Server> {
    return new Promise<http.Server>((resolve, reject) => {
        const server = http.createServer(dependencies.appServer);

        dependencies.webSocketRouter.start(server);

        server.listen(port, host);

        const onError = (error: Error) => {
            server.off("listening", onListening);
            reject(error);
        };

        const onListening = () => {
            server.off("error", onError);
            resolve(server);
        };

        server.once("error", onError);
        server.once("listening", onListening);
    });
}
