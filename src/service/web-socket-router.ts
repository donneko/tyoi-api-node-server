import { ApiRegistry, type ApiRegistryHandler } from "../util/api-registry.js";
import type { Server } from "node:http";
import { WebSocketServer } from "ws";
import type { WebSocket } from "ws";
import type { Duplex } from "node:stream";
import type { IncomingMessage } from "node:http";

export type WsHandler = {
    ws: WebSocket;
    req: IncomingMessage;
};

export class WebSocketRouter<typeMAP extends string> {
    private webSocketRegistry = new ApiRegistry<Record<typeMAP, WsHandler>>();

    start(server: Server) {
        const wss = new WebSocketServer({
            noServer: true,
        });

        server.on("upgrade", (req, socket, head) => {
            const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
            const pathname = url.pathname;

            if (!this.webSocketRegistry.has(pathname)) {
                socket.destroy();
                return;
            }

            wss.handleUpgrade(req, socket as Duplex, head, (ws) => {
                this.webSocketRegistry.emit(pathname, { ws, req });
            });
        });
    }

    // WebSocket登録
    on<Key extends typeMAP>(type: Key, fn: ApiRegistryHandler<WsHandler>) {
        return this.webSocketRegistry.on(type, fn);
    }
    // WebSocket一度のみ起動
    once<Key extends typeMAP>(type: Key, fn: ApiRegistryHandler<WsHandler>) {
        return this.webSocketRegistry.once(type, fn);
    }
    // WebSocket消去
    off<Key extends typeMAP>(type: Key) {
        this.webSocketRegistry.off(type);
    }
    // WebSocketが存在するか？
    has(type: string) {
        return this.webSocketRegistry.has(type);
    }
}
