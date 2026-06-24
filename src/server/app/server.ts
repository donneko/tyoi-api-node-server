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
import type { OutEventBusMap } from "../../types/out.event-bus.type.js";
import type { InnerEventBusMap } from "../../types/inner.event-bus.type.js";
import { ServicesRegister } from "../../util/services-register.js";
import { HttpMetaManager } from "../../service/http-meta/http-meta-manager.js";
import { SystemMetaManager } from "../../service/system-meta/system-meta-manager.js";
import { configManager } from "../../service/config-manager.js";
import { RegisterManager } from "../../service/register-manager.js";
import { WebSocketRouter, type WsHandler } from "../../service/web-socket-router.js";

export type RequestData = {
    query: unknown;
    body: unknown;
    headers: unknown;
};
type RequestEventMap<L extends string> = {
    [N in L]: RequestData;
};
export type StartServerOptions = {
    port?: number;
    exposeLan?: boolean;
    showQrCode?: boolean;
    autoPort?: boolean;
    openBrowser?: BrowserOpenConfig;
};
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
     * expressを使用した簡単なサーバーを作れるようにします。
     * @param baseDirname ベースのファイルURL
     * @param publicDirname public内で公開するディレクトリ名
     * @param port 公開ポート
     * @param middlewares 追加するミドルウェア
     * @example
     *  import { Server } from "./app/server.js";
     *  import morgan from "morgan";
     *
     *  type RequestNameList = "GET:/test" | "GET:/test/a" | "GET:/a";
     *
     *  const server = new Server<RequestNameList>({
     *      baseDirname:import.meta.dirname,
     *      publicDirname:"../public/main",
     *      apiPrefix:"/api",
     *      port:3000,
     *      middlewares:[
     *          morgan("dev")
     *      ]
     *  });
     *
     *  server.startServer();
     *  server.onAPI("GET:/test",(data)=>{
     *      return data;
     *  })
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
     * サーバーの起動する。
     * @param options サーバー起動時の便利なオプションを設定できます
     * @returns http.serverを返します
     * @example
     * await server.startServer({
            exposeLan:true,
            showQrCode: false,
            port:3000
        });
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

    // Event登録
    onEvent<Key extends keyof OutEventBusMap>(type: Key, fn: EventBusHandler<OutEventBusMap[Key]>) {
        return this.#outEventBus.on(type, fn);
    }
    // Event一度のみ起動
    onceEvent<Key extends keyof OutEventBusMap>(
        type: Key,
        fn: EventBusHandler<OutEventBusMap[Key]>
    ) {
        return this.#outEventBus.once(type, fn);
    }
    // Event消去
    offEvent<Key extends keyof OutEventBusMap>(
        type: Key,
        fn: EventBusHandler<OutEventBusMap[Key]>
    ) {
        this.#outEventBus.off(type, fn);
    }
    // Eventが存在するか？
    hasEvent<Key extends keyof OutEventBusMap>(type: Key) {
        return this.#outEventBus.has(type);
    }

    // API登録
    onAPI<Key extends keyof RequestEventMap<RequestNameList>>(
        type: Key,
        fn: ApiRegistryHandler<RequestEventMap<RequestNameList>[Key]>
    ) {
        return this.#serverAPIs.on(type, fn);
    }
    // API一度のみ起動
    onceAPI<Key extends keyof RequestEventMap<RequestNameList>>(
        type: Key,
        fn: ApiRegistryHandler<RequestEventMap<RequestNameList>[Key]>
    ) {
        return this.#serverAPIs.once(type, fn);
    }
    // API消去
    offAPI<Key extends keyof RequestEventMap<RequestNameList>>(type: Key) {
        this.#serverAPIs.off(type);
    }
    // APIが存在するか？
    hasAPI<Key extends keyof RequestEventMap<RequestNameList>>(type: Key) {
        return this.#serverAPIs.has(type);
    }
    // API手動実行
    emitAPI<Key extends keyof RequestEventMap<RequestNameList>>(
        type: Key,
        data: RequestEventMap<RequestNameList>[Key]
    ) {
        return this.#serverAPIs.emit(type, data);
    }

    // WebSocket登録
    onWebSocket<Key extends WebSocketNameList>(type: Key, fn: ApiRegistryHandler<WsHandler>) {
        return this.#webSocketRouter.on(type, fn);
    }
    // WebSocket一度のみ起動
    onceWebSocket<Key extends WebSocketNameList>(type: Key, fn: ApiRegistryHandler<WsHandler>) {
        return this.#webSocketRouter.once(type, fn);
    }
    // WebSocket消去
    offWebSocket<Key extends WebSocketNameList>(type: Key) {
        this.#webSocketRouter.off(type);
    }
    // WebSocketが存在するか？
    hasWebSocket(type: string) {
        return this.#webSocketRouter.has(type);
    }

    // サーバー起動中か？
    isRunning(): boolean {
        return this.#httpServer !== null;
    }
    // サーバーポート取得
    getPort(): number {
        return this.#serverConfig.getConfig("port");
    }
    // サーバー設定取得
    getConfig<K extends keyof ServerDefaultConfig>(key: K): ServerDefaultConfig[K] {
        return this.#serverConfig.getConfig(key);
    }
    // HTTPサーバー取得
    getHttpServer(): http.Server | null {
        return this.#httpServer;
    }
}
