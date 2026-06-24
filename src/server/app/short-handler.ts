import { Server, type ServerOptions, type RequestData, type StartServerOptions } from "./server.js";
import { ApiRegistryHandler } from "../util/api-registry.js";
import type { WsHandler } from "../service/web-socket-router.js";
import http from "node:http";

class shortHandler {
    private server: Server;

    constructor(server: Server) {
        this.server = server;
    }
    get tyoiServer() {
        return this.server;
    }

    get(pass: string, fn: ApiRegistryHandler<RequestData>): this {
        this.server.onAPI(`GET:${pass}`, fn);
        return this;
    }
    post(pass: string, fn: ApiRegistryHandler<RequestData>): this {
        this.server.onAPI(`POST:${pass}`, fn);
        return this;
    }
    ws(pass: string, fn: ApiRegistryHandler<WsHandler>): this {
        this.server.onWebSocket(`${pass}`, fn);
        return this;
    }
    async start(options?: StartServerOptions): Promise<http.Server | undefined> {
        return this.server.startServer(options);
    }
    async close(): Promise<void> {
        this.server.stopServer();
    }
}

export function tyoi(options: ServerOptions): shortHandler {
    const server = new Server(options);
    return new shortHandler(server);
}
