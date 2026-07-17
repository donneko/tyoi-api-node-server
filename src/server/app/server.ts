import express from "express";
import http from "node:http";

import { pathNormalization } from "../../service/path-normalization.js";
import { ApiRegistry, ApiRegistryHandler } from "../../util/api-registry.js";
import { findAvailablePort } from "../../service/find-available-port.js";
import type {
    BrowserOpenConfig,
    ServerDefaultConfig,
    ServerUserConfig,
} from "../../types/config.type.js";
import { serverStartSummary } from "../../service/server-start-summary.js";
import { openBrowser } from "../../service/open-browser.js";
import { EventBus, EventBusHandler } from "../../util/event-bus.js";
import { ServerLogger } from "../../service/server-logger.js";
import type { OutEventBusMap, InnerEventBusMap } from "../../types/event-bus.type.js";
import { ServicesRegister } from "../../util/services-register.js";
import { HttpMetaManager } from "../../service/http-meta/http-meta-manager.js";
import { SystemMetaManager } from "../../service/system-meta/system-meta-manager.js";
import { configManager } from "../../service/config-manager.js";
import { RegisterManager } from "../../service/register-manager.js";
import { WebSocketRouter, type WsHandler } from "../../service/web-socket-router.js";

/** HTTP API ハンドラに渡されるリクエスト情報です。 */
export type RequestData = {
    query: unknown;
    body: unknown;
    headers: unknown;
};
export type RequestEventMap<L extends string> = {
    [N in L]: RequestData;
};
/** `startServer()` 呼び出し時に上書きできる起動設定です。 */
export type StartServerOptions = {
    port?: number;
    exposeLan?: boolean;
    showQrCode?: boolean;
    autoPort?: boolean;
    openBrowser?: BrowserOpenConfig;
};
/** `Server` をコードから作成するための設定です。 */
export type ServerOptions = ServerUserConfig & {
    baseDirname: string;
};

function removeUndefinedConfig(config: ServerUserConfig): Partial<ServerDefaultConfig> {
    return Object.fromEntries(
        Object.entries(config).filter(([, value]) => value !== undefined)
    ) as Partial<ServerDefaultConfig>;
}

export type ServerServicesRegister = {
    innerEventBus: EventBus<InnerEventBusMap>;
    outEventBus: EventBus<OutEventBusMap>;
    serverLogger: ServerLogger;
    httpMetaManager: HttpMetaManager;
    systemMetaManager: SystemMetaManager;
    serverConfig: configManager;
    serverRegister: RegisterManager;
};

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
    #appServer = express();
    #serverAPIs = new ApiRegistry<RequestEventMap<RequestNameList>>();
    #outEventBus = new EventBus<OutEventBusMap>();
    #innerEventBus = new EventBus<InnerEventBusMap>();
    #serverLogger = new ServerLogger(this.#innerEventBus, this.#outEventBus);
    #httpServer: http.Server | null = null;
    #serverConfig: configManager = new configManager();
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

        this.#init();
        this.#initServer();
    }

    // サーバー作成前の設定
    #init() {
        const baseDirname = this.#serverConfig.getConfig("baseDirname");
        const publicDirname = this.#serverConfig.getConfig("publicDirname");
        const signalShutdownHandling = this.#serverConfig.getConfig("signalShutdownHandling");

        if (!baseDirname) throw new Error("baseDirname is required");

        this.#serverConfig.updateConfig({ baseDirname });

        const publicDirectoryPath = pathNormalization(baseDirname, publicDirname);
        this.#serverRegister.updateConfig({ publicDirectoryPath });

        if (signalShutdownHandling) {
            process.on("SIGINT", async () => {
                await this.#shutdownServer();
            });
            process.on("SIGTERM", async () => {
                await this.#shutdownServer();
            });
        }
    }

    // サーバー作成
    #initServer() {
        const middlewares = this.#serverConfig.getConfig("middlewares");
        const apiPrefix = this.#serverConfig.getConfig("apiPrefix");
        const publicDirectoryPath = this.#serverRegister.getConfig("publicDirectoryPath") ?? "";

        // ミドルウェアと追加する。
        for (const middleware of middlewares) {
            this.#appServer.use(middleware);
        }
        // JSONを受け取れるようにする
        this.#appServer.use(express.json());

        // API
        this.#appServer.use(apiPrefix, (req, res) => {
            this.#apiProcess(req, res);
        });

        // 静的ファイル配信
        this.#appServer.use(express.static(publicDirectoryPath));

        this.#appServer.use((req, res) => {
            const sendData = this.#serverServicesRegister.get("httpMetaManager").getMeta(404);
            res.status(sendData.code).send(
                `<h1>${sendData.message}</h1><br><p>${sendData.description}</p>`
            );
        });
    }

    // サーバーAPI処理
    async #apiProcess(req: express.Request, res: express.Response) {
        try {
            const key = `${req.method}:${req.path}`;

            if (!this.#serverAPIs.has(key)) {
                res.status(404).json({
                    ok: false,
                    code: "API_NOT_FOUND",
                    message: "API not found",
                });
                return;
            }

            const result = await this.#serverAPIs.emit(key, {
                query: req.query,
                body: req.body,
                headers: req.headers,
            });

            res.json({
                ok: true,
                data: result,
            });
        } catch {
            res.status(500).json({
                ok: false,
                code: "API_INTERNAL_ERROR",
                message: "Internal server error",
            });
        }
    }

    async #createHttpServer(port: number, host: string): Promise<http.Server> {
        const httpServer = await new Promise<http.Server>((resolve, reject) => {
            const server = http.createServer(this.#appServer);

            this.#webSocketRouter.start(server);

            server.listen(port, host);

            const onError = (error: Error) => {
                server.off("listening", onListening);
                this.#httpServer = null;
                reject(error);
            };

            const onListening = () => {
                server.off("error", onError);
                resolve(server);
            };

            server.once("error", onError);
            server.once("listening", onListening);

            this.#httpServer = server;
        });

        return httpServer;
    }

    #isShuttingDown: boolean = false;
    async #shutdownServer() {
        if (this.#isShuttingDown) return;
        this.#isShuttingDown = true;

        this.#serverLogger.logger("bar");
        this.#serverLogger.logger(
            "process",
            this.#serverServicesRegister.get("systemMetaManager").getMeta(100).message
        );

        await this.stopServer();

        this.#serverLogger.logger(
            "success",
            this.#serverServicesRegister.get("systemMetaManager").getMeta(101).message
        );
    }

    #isStarting: boolean = false;
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
    async startServer(options?: StartServerOptions): Promise<http.Server | undefined> {
        try {
            if (this.#httpServer) {
                this.#serverLogger.logger(
                    "warn",
                    this.#serverServicesRegister.get("systemMetaManager").getMeta(102).message
                );
                return;
            }
            if (this.#isStarting) return;
            this.#isStarting = true;

            // this.#innerEventBus.emit("server/start:process", {});

            if (options) {
                this.#serverConfig.updateConfig(removeUndefinedConfig(options));
            }
            const exposeLan = this.#serverConfig.getConfig("exposeLan");
            const autoPort = this.#serverConfig.getConfig("autoPort");
            const showQrCode = this.#serverConfig.getConfig("showQrCode");
            const publicDirname = this.#serverConfig.getConfig("publicDirname");
            const openBrowserConfig = this.#serverConfig.getConfig("openBrowser");
            const apiPrefix = this.#serverConfig.getConfig("apiPrefix");
            const configPort = this.#serverConfig.getConfig("port");
            const publicDirectoryPath = this.#serverRegister.getConfig("publicDirectoryPath") ?? "";

            // ホスト設定
            const host = exposeLan ? "0.0.0.0" : "127.0.0.1";

            // ポート設定
            // MEMO constructorで設定した値がデフォルトで上書きされる可能性があるから、ifはoptionsで比較
            const tmpPort = await findAvailablePort({
                startPort: configPort,
                host,
                isAutoPort: autoPort,
                servicesRegister: this.#serverServicesRegister,
            });

            // サーバー起動処理
            const httpServer = await this.#createHttpServer(tmpPort, host);
            const address = httpServer.address();
            const port = typeof address === "object" && address !== null ? address.port : tmpPort;
            this.#serverConfig.updateConfig({ port });

            // スタートログ
            serverStartSummary({
                host,
                port,
                publicPath: publicDirname,
                publicFullPath: publicDirectoryPath,
                apiPrefix: apiPrefix,
                isShowQrCode: showQrCode,
                servicesRegister: this.#serverServicesRegister,
            });

            // ブラウザオープン
            if (openBrowserConfig) {
                await openBrowser({
                    host,
                    port,
                    target: openBrowserConfig,
                    servicesRegister: this.#serverServicesRegister,
                });
            }

            // this.#innerEventBus.emit("server/start:success", {});
            this.#isStarting = false;
            return httpServer;
        } catch (error) {
            this.#isStarting = false;

            this.#serverLogger.logger(
                "error",
                this.#serverServicesRegister.get("systemMetaManager").getMeta(103).message
            );

            if (error instanceof Error) {
                this.#serverLogger.logger("error", error.message);
                this.#innerEventBus.emit("server/start:error", { error });
            } else {
                this.#innerEventBus.emit("server/start:error", {});
            }

            throw error;
        }
    }
    #isStopServer: boolean = false;
    /**
     * HTTP サーバーを停止し、既存の接続を終了します。
     *
     * 接続が 10 秒以内に閉じない場合は、残った接続を強制的に閉じます。
     * 起動していない場合、または停止処理中の場合は何もしません。
     *
     * @returns 停止完了時に解決する Promise。
     * @throws HTTP サーバーの停止に失敗した場合。
     */
    async stopServer(): Promise<void> {
        const server = this.#httpServer;
        if (!server) return;

        if (this.#isStopServer) return;
        this.#isStopServer = true;

        return new Promise<void>((resolve, reject) => {
            let settled = false;
            const finish = () => {
                if (settled) return;
                settled = true;

                clearTimeout(timeout);
                this.#isStopServer = false;
                this.#httpServer = null;
            };
            this.#serverLogger.logger(
                "process",
                this.#serverServicesRegister.get("systemMetaManager").getMeta(104).message
            );
            // this.#innerEventBus.emit("server/stop:process", {});

            const timeout = setTimeout(() => {
                if (settled) return;

                server?.closeAllConnections();
                this.#serverLogger.logger(
                    "warn",
                    this.#serverServicesRegister.get("systemMetaManager").getMeta(105).message
                );
                // this.#innerEventBus.emit("server/stop:timeout", {});

                finish();
                resolve();
            }, 10000);

            server?.close((error) => {
                if (settled) return;

                if (error) {
                    this.#serverLogger.logger(
                        "error",
                        this.#serverServicesRegister.get("systemMetaManager").getMeta(106).message
                    );
                    // this.#innerEventBus.emit("server/stop:error", {});

                    finish();
                    reject(error);
                    return;
                }
                this.#serverLogger.logger(
                    "success",
                    this.#serverServicesRegister.get("systemMetaManager").getMeta(107).message
                );
                // this.#innerEventBus.emit("server/stop:success", {});

                finish();
                resolve();
            });
            server?.closeIdleConnections();
        });
    }

    /** イベントハンドラを登録します。 */
    onEvent<Key extends keyof OutEventBusMap>(type: Key, fn: EventBusHandler<OutEventBusMap[Key]>) {
        return this.#outEventBus.on(type, fn);
    }
    /** 一度だけ実行するイベントハンドラを登録します。 */
    onceEvent<Key extends keyof OutEventBusMap>(
        type: Key,
        fn: EventBusHandler<OutEventBusMap[Key]>
    ) {
        return this.#outEventBus.once(type, fn);
    }
    /** イベントハンドラを解除します。 */
    offEvent<Key extends keyof OutEventBusMap>(
        type: Key,
        fn: EventBusHandler<OutEventBusMap[Key]>
    ) {
        this.#outEventBus.off(type, fn);
    }
    /** 指定したイベントにハンドラが登録されているかを返します。 */
    hasEvent<Key extends keyof OutEventBusMap>(type: Key) {
        return this.#outEventBus.has(type);
    }

    /** HTTP API ハンドラを登録します。 */
    onAPI<Key extends keyof RequestEventMap<RequestNameList>>(
        type: Key,
        fn: ApiRegistryHandler<RequestEventMap<RequestNameList>[Key]>
    ) {
        return this.#serverAPIs.on(type, fn);
    }
    /** 一度だけ実行する HTTP API ハンドラを登録します。 */
    onceAPI<Key extends keyof RequestEventMap<RequestNameList>>(
        type: Key,
        fn: ApiRegistryHandler<RequestEventMap<RequestNameList>[Key]>
    ) {
        return this.#serverAPIs.once(type, fn);
    }
    /** HTTP API ハンドラを解除します。 */
    offAPI<Key extends keyof RequestEventMap<RequestNameList>>(type: Key) {
        this.#serverAPIs.off(type);
    }
    /** 指定した HTTP API ハンドラが登録されているかを返します。 */
    hasAPI<Key extends keyof RequestEventMap<RequestNameList>>(type: Key) {
        return this.#serverAPIs.has(type);
    }
    /** HTTP API ハンドラをリクエストなしで実行します。 */
    emitAPI<Key extends keyof RequestEventMap<RequestNameList>>(
        type: Key,
        data: RequestEventMap<RequestNameList>[Key]
    ) {
        return this.#serverAPIs.emit(type, data);
    }

    /** WebSocket ハンドラを登録します。 */
    onWebSocket<Key extends WebSocketNameList>(type: Key, fn: ApiRegistryHandler<WsHandler>) {
        return this.#webSocketRouter.on(type, fn);
    }
    /** 一度だけ実行する WebSocket ハンドラを登録します。 */
    onceWebSocket<Key extends WebSocketNameList>(type: Key, fn: ApiRegistryHandler<WsHandler>) {
        return this.#webSocketRouter.once(type, fn);
    }
    /** WebSocket ハンドラを解除します。 */
    offWebSocket<Key extends WebSocketNameList>(type: Key) {
        this.#webSocketRouter.off(type);
    }
    /** 指定した WebSocket ハンドラが登録されているかを返します。 */
    hasWebSocket(type: string) {
        return this.#webSocketRouter.has(type);
    }

    /** サーバーが起動中かを返します。 */
    isRunning(): boolean {
        return this.#httpServer !== null;
    }
    /** 現在設定されているポート番号を返します。 */
    getPort(): number {
        return this.#serverConfig.getConfig("port");
    }
    /** 解決済みのサーバー設定を取得します。 */
    getConfig<K extends keyof ServerDefaultConfig>(key: K): ServerDefaultConfig[K] {
        return this.#serverConfig.getConfig(key);
    }
    /** 基盤となる Node.js の HTTP サーバーを取得します。 */
    getHttpServer(): http.Server | null {
        return this.#httpServer;
    }
}
