import { Server, type ServerOptions, type RequestData, type StartServerOptions } from "./server.js";
import { ApiRegistryHandler } from "../../util/api-registry.js";
import type { WsHandler } from "../../service/web-socket-router.js";
import http from "node:http";

/**
 * `tyoi()` が返す簡易サーバー API。
 *
 * API と WebSocket を登録し、必要に応じて `tyoiServer` から
 * 基盤となる `Server` の全機能へアクセスできます。
 */
class shortHandler {
    private server: Server;

    constructor(server: Server) {
        this.server = server;
    }
    /** 基盤となる `Server` インスタンスを取得します。 */
    get tyoiServer(): Server {
        return this.server;
    }

    /** GET API ハンドラを登録します。 */
    get(pass: string, fn: ApiRegistryHandler<RequestData>): this {
        this.server.onAPI(`GET:${pass}`, fn);
        return this;
    }
    /** POST API ハンドラを登録します。 */
    post(pass: string, fn: ApiRegistryHandler<RequestData>): this {
        this.server.onAPI(`POST:${pass}`, fn);
        return this;
    }
    /** WebSocket ハンドラを登録します。 */
    ws(pass: string, fn: ApiRegistryHandler<WsHandler>): this {
        this.server.onWebSocket(`${pass}`, fn);
        return this;
    }
    /** `start()` の別名です。 */
    async listen(options?: StartServerOptions): Promise<http.Server | undefined> {
        return this.start(options);
    }
    /** サーバーを起動します。 */
    async start(options?: StartServerOptions): Promise<http.Server | undefined> {
        return this.server.startServer(options);
    }
    /** サーバーを停止し、接続の終了を待機します。 */
    async close(): Promise<void> {
        return this.server.stopServer();
    }
}

/**
 * API と WebSocket の登録を簡潔に行うサーバーを作成します。
 *
 * @param options サーバー設定。`baseDirname` は必須です。
 * @returns API 登録・起動・停止を行う簡易 API。
 *
 * @example
 * ```ts
 * const app = tyoi({
 *   baseDirname: import.meta.dirname,
 *   publicDirname: "../public/main",
 * });
 *
 * app.get("/health", () => ({ ok: true }));
 * await app.start();
 * ```
 */
export function tyoi(options: ServerOptions): shortHandler {
    const server = new Server(options);
    return new shortHandler(server);
}
