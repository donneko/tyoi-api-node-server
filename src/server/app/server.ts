import express from "express";
import http from "node:http";

import { ApiRegistry } from "../../util/api-registry.js";
import type { ServerDefaultConfig, ServerUserConfig } from "../types/server-config.type.js";
import { EventBus } from "../../util/event-bus.js";
import { ServerLogger } from "../../service/server-logger.js";
import type { OutEventBusMap, InnerEventBusMap } from "../types/server-event-bus.type.js";
import { ServicesRegister } from "../../util/services-register.js";
import { HttpMetaManager } from "../../service/http-meta/http-meta-manager.js";
import { SystemMetaManager } from "../../service/system-meta/system-meta-manager.js";
import { configManager } from "../../service/config-manager.js";
import { RegisterManager } from "../../service/register-manager.js";
import { WebSocketRouter } from "../../service/web-socket-router.js";
import { startServer, isServerStart } from "../logic/start-server/index.js";
import type {
    ServerStartServerDependencies,
    ServerStopDependencies,
} from "../types/server-dependencies.type.js";
import type { ServerStartUseConfig } from "../types/server.type.js";
import { isServerStop, stopServer } from "../logic/stop-server/index.js";
import { setupExpress } from "../logic/setup-express/index.js";
import { setupServer } from "../logic/setup-server/index.js";

function removeUndefinedConfig(config: ServerUserConfig): Partial<ServerDefaultConfig> {
    return Object.fromEntries(
        Object.entries(config).filter(([, value]) => value !== undefined)
    ) as Partial<ServerDefaultConfig>;
}

/**
 * HTTP API、WebSocket、静的ファイル配信を提供するサーバーです。
 *
 * @typeParam RequestNameList 登録できる HTTP API キー（例: `"GET:/health"`）。
 * @typeParam WebSocketNameList 登録できる WebSocket パス。
 */
export class Server<
    RequestNameList extends string = string,
    WebSocketNameList extends string = string,
> {
    private expressServer = express();
    #serverAPIs = new ApiRegistry<RequestEventMap<RequestNameList>>();
    #outEventBus = new EventBus<OutEventBusMap>();
    #innerEventBus = new EventBus<InnerEventBusMap>();
    #serverLogger = new ServerLogger(this.#innerEventBus, this.#outEventBus);
    private httpServer: http.Server | null = null;
    private serverConfig: configManager = new configManager();
    #serverRegister: RegisterManager = new RegisterManager();
    #serverServicesRegister = new ServicesRegister<ServerServicesRegister>({
        innerEventBus: this.#innerEventBus,
        outEventBus: this.#outEventBus,
        serverLogger: this.#serverLogger,
        httpMetaManager: new HttpMetaManager(),
        systemMetaManager: new SystemMetaManager(),
        serverConfig: this.#serverConfig,
        serverRegister: this.#serverRegister,
    });
    #webSocketRouter = new WebSocketRouter<WebSocketNameList>();

    /**
     * サーバーを作成し、ルーティングと静的ファイル配信を初期化します。
     *
     * `baseDirname` は必須です。起動は `startServer()` で明示的に行います。
     *
     * @param options サーバー設定。
     * @example
     *  import { Server } from "@donneko/tyoi-server";
     *
     *  type RequestNameList = "GET:/test" | "GET:/test/a" | "GET:/a";
     *
     *  const server = new Server<RequestNameList>({
     *      baseDirname: import.meta.dirname,
     *      publicDirname:"../public/main",
     *      apiPrefix:"/api",
     *      port:3000,
     *  });
     *
     *  server.onAPI("GET:/test", (data) => {
     *      return data;
     *  });
     *  await server.startServer();
     */
    constructor(options?: ServerOptions) {
        if (options) {
            this.#serverConfig.updateConfig(removeUndefinedConfig(options));
        }

        setupServer();
        setupExpress();
    }

    private isStarting: boolean = false;
    /**
     * HTTP サーバーを起動します。
     *
     * `options` はコンストラクターで渡した設定を、この起動に限らず
     * 上書きします。すでに起動済み、または起動処理中の場合は `undefined` を返します。
     *
     * @param options 起動時に上書きする設定。
     * @returns 起動した HTTP サーバー。すでに起動済みの場合は `undefined`。
     * @throws ポートの確保や HTTP サーバーの起動に失敗した場合。
     * @example
     * ```ts
     * await server.startServer({
     *   port: 3000,
     *   showQrCode: false,
     * });
     * ```
     */
    async start(
        options: ServerStartUseConfig, // !! 一時的にオプション解除。必ずオプションに！！
        dependencies: ServerStartServerDependencies // TODO あとで、ここをオプションにする
    ): Promise<http.Server | undefined> {
        if (!isServerStart(this.httpServer, this.isStarting)) {
            dependencies.serverLogger.logger(
                "warn",
                dependencies.systemMetaManager.getMeta(102).message
            );
            return;
        }

        this.isStarting = true;

        const httpServer = await startServer(options, dependencies).finally(
            () => (this.isStarting = false)
        );

        this.httpServer = httpServer;

        return httpServer;
    }

    private isStopping: boolean = false;
    /**
     * HTTP サーバーを停止し、既存の接続を終了します。
     *
     * 接続が 10 秒以内に閉じない場合は、残った接続を強制的に閉じます。
     * 起動していない場合、または停止処理中の場合は何もしません。
     *
     * @returns 停止完了時に解決する Promise。
     * @throws HTTP サーバーの停止に失敗した場合。
     */
    async stop(dependencies: ServerStopDependencies): Promise<void> {
        if (!isServerStop(this.httpServer, this.isStopping)) return;

        this.isStopping = true;

        await stopServer(this.httpServer, dependencies).finally(() => {
            this.httpServer = null;
            this.isStopping = false;
        });
    }

    /** サーバーが起動中かを返します。 */
    isRunning(): boolean {
        return Boolean(this.httpServer);
    }
    /** 現在設定されているポート番号を返します。 */
    getPort(): number {
        return this.serverConfig.getConfig("port");
    }
    /** 基盤となる Node.js の HTTP サーバーを取得します。 */
    getHttpServer(): http.Server | null {
        return this.httpServer;
    }
    /** 解決済みのサーバー設定を取得します。 */
    getConfig = this.serverConfig.getConfig;

    /** イベントハンドラを登録します。 */
    onEvent = this.#outEventBus.on;
    /** 一度だけ実行するイベントハンドラを登録します。 */
    onceEvent = this.#outEventBus.once;
    /** イベントハンドラを解除します。 */
    offEvent = this.#outEventBus.off;
    /** 指定したイベントにハンドラが登録されているかを返します。 */
    hasEvent = this.#outEventBus.has;

    /** HTTP API ハンドラを登録します。 */
    onAPI = this.#serverAPIs.on;
    /** 一度だけ実行する HTTP API ハンドラを登録します。 */
    onceAPI = this.#serverAPIs.once;
    /** HTTP API ハンドラを解除します。 */
    offAPI = this.#serverAPIs.off;
    /** 指定した HTTP API ハンドラが登録されているかを返します。 */
    hasAPI = this.#serverAPIs.has;
    /** HTTP API ハンドラをリクエストなしで実行します。 */
    emitAPI = this.#serverAPIs.emit;

    /** WebSocket ハンドラを登録します。 */
    onWebSocket = this.#webSocketRouter.on;
    /** 一度だけ実行する WebSocket ハンドラを登録します。 */
    onceWebSocket = this.#webSocketRouter.once;
    /** WebSocket ハンドラを解除します。 */
    offWebSocket = this.#webSocketRouter.off;
    /** 指定した WebSocket ハンドラが登録されているかを返します。 */
    hasWebSocket = this.#webSocketRouter.has;
}
