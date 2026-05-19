import express from "express";
import http from "node:http";

import TYOI_DEFAULT_CONFIG from "../config/tyoi.default.config.js"
import { pathNormalization } from "../service/path-normalization.js";
import { ApiRegistry , ApiRegistryHandler} from "../util/api-registry.js";
import { logger } from "../util/logger.js";
import { findAvailablePort } from "../service/find-available-port.js";
import type { BrowserOpenConfig,ServerDefaultConfig,ServerUserConfig } from "../types/config.type.js"
import { serverStartSummary } from "../service/server-start-summary.js";
import { openBrowser } from "../service/open-browser.js";
import { EventBus ,EventBusHandler} from "../util/event-bus.js";
import { ServerLogger } from "../service/server-logger.js";
import type { OutEventBusMap } from "../types/out.event-bus.type.js";
import type { InnerEventBusMap } from "../types/inner.event-bus.type.js";
import { ServicesRegister } from "../util/services-register.js";

type RequestData = {
    query  : unknown,
    body   : unknown,
    headers: unknown
}
type RequestEventMap<L extends string> = {
    [N in L]: RequestData;
}
type StartServerOptions = {
    port?: number;
    exposeLan?: boolean;
    showQrCode?:boolean;
    autoPort?:boolean;
    openBrowser?:BrowserOpenConfig;
};
type initConfigData = {
    baseDirname:string;
    publicDirname:string;
    port:number;
}
type ServerOptions = ServerUserConfig & {
    baseDirname: string;
}

type ServerConfig = ServerDefaultConfig & {
    baseDirname: string;
}

type ServerServicesRegister = {
    logger: typeof logger;
    innerEventBus:EventBus<InnerEventBusMap>;
    outEventBus:EventBus<OutEventBusMap>;
    serverLogger:ServerLogger
}

export class Server<RequestNameList extends string>
{
    #appServer = express();
    #publicDirectoryPath!:string;
    #serverPort!:number;
    #serverAPIs = new ApiRegistry<RequestEventMap<RequestNameList>>();
    #outEventBus = new EventBus<OutEventBusMap>();
    #innerEventBus = new EventBus<InnerEventBusMap>();
    #serverLogger = new ServerLogger(this.#innerEventBus);
    #httpServer: http.Server | null = null;
    #SERVER_DEFAULT_CONFIG:ServerDefaultConfig = TYOI_DEFAULT_CONFIG;
    #serverConfig!:ServerConfig;
    #serverServicesRegister = new ServicesRegister<ServerServicesRegister>({
        logger:logger,
        innerEventBus:this.#innerEventBus,
        outEventBus:this.#outEventBus,
        serverLogger:this.#serverLogger,
    });

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
    constructor(options:ServerOptions){

        this.#serverConfig = {...this.#SERVER_DEFAULT_CONFIG,...options};

        this.#init();
        this.#initServer();
    }

    // サーバー作成前の設定
    #init(){
        const {
            baseDirname,
            publicDirname,
            port,
            signalShutdownHandling
        } = this.#serverConfig;

        this.#publicDirectoryPath = pathNormalization(baseDirname,publicDirname);
        this.#serverPort = port;

        if(signalShutdownHandling){
            process.on("SIGINT" , async ()=>{ await this.#shutdownServer() });
            process.on("SIGTERM", async ()=>{ await this.#shutdownServer() });
        }
    }

    // サーバー作成
    #initServer(){
        const {
            middlewares,
            apiPrefix
        } = this.#serverConfig;

        // ミドルウェアと追加する。
        for(const middleware of middlewares){
            this.#appServer.use(middleware);
        }
        // JSONを受け取れるようにする
        this.#appServer.use(express.json());

        // API
        this.#appServer.use(apiPrefix, (req, res) => {
            this.#apiProcess(req, res);
        });

        // 静的ファイル配信
        this.#appServer.use(express.static(this.#publicDirectoryPath));

        this.#appServer.use((req, res) => {
            res.status(404).send("Not Found");
        });
    }

    // サーバーAPI処理
    async #apiProcess(req:express.Request, res:express.Response) {
        try {
            const key = `${req.method}:${req.path}`;

            if (!this.#serverAPIs.has(key)) {
                res.status(404).json({
                    ok: false,
                    code: "API_NOT_FOUND",
                    message: "API not found"
                });
                return;
            }

            const result = await this.#serverAPIs.emit(key, {
                query: req.query,
                body: req.body,
                headers: req.headers
            });

            res.json({
                ok: true,
                data: result
            });

        } catch (error) {
            res.status(500).json({
                ok: false,
                code: "API_INTERNAL_ERROR",
                message: "Internal server error"
            });
        }
    };

    async #createHttpServer(port:number,host:string):Promise<http.Server>{
        const httpServer = await new Promise<http.Server>((resolve,reject)=>{
            const server = this.#appServer.listen(port,host);

            const onError = (error: Error) => {
                server.off("listening",onListening);
                this.#httpServer = null;
                reject(error);
            };

            const onListening = () => {
                server.off("error",onError);
                resolve(server);
            };

            server.once("error",onError);
            server.once("listening",onListening);

            this.#httpServer = server;
        });

        return httpServer;
    }

    #isShuttingDown:boolean = false;
    async #shutdownServer(){
        if(this.#isShuttingDown) return;
        this.#isShuttingDown = true;

        logger.bar();
        this.#serverLogger.logger("process","サーバーをシャットダウン中...");

        await this.stopServer();

        this.#serverLogger.logger("success","サーバーをシャットダウンしました。");

    }

    #isStarting:boolean = false;
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
    async startServer(options?:StartServerOptions){
        try {
            if(this.#httpServer){
                this.#serverLogger.logger("warn","すでにサーバーは起動しています。");
                return;
            }
            if(this.#isStarting) return;
            this.#isStarting = true;

            this.#innerEventBus.emit("server/start:process",{});
            const startServerOptions = {...this.#serverConfig,...options};

            // ホスト設定
            const host = startServerOptions.exposeLan ? "0.0.0.0" : "127.0.0.1";

            // ポート設定
            // MEMO constructorで設定した値がデフォルトで上書きされる可能性があるから、ifはoptionsで比較
            if(options?.port !== undefined)this.#serverPort = options.port;
            this.#serverPort = await findAvailablePort({
                startPort:this.#serverPort,
                host,
                isAutoPort:startServerOptions.autoPort,
            });
            const port = this.#serverPort;

            // サーバー起動処理
            const httpServer = await this.#createHttpServer(port,host);
            const address = httpServer.address();
            const listeningPort = typeof address === "object" && address !== null
                ? address.port
                : port;
            this.#serverPort = listeningPort;

            // スタートログ
            serverStartSummary({
                host,
                port:listeningPort,
                publicPath:startServerOptions.publicDirname,
                publicFullPath:this.#publicDirectoryPath,
                apiPrefix:startServerOptions.apiPrefix,
                isShowQrCode:startServerOptions.showQrCode,
            });

            // ブラウザオープン
            if(startServerOptions.openBrowser){
                await openBrowser({
                    host,
                    port:listeningPort,
                    target:startServerOptions.openBrowser
                });
            }

            this.#innerEventBus.emit("server/start:success",{});
            this.#isStarting = false;
            return httpServer;

        } catch (error) {
            this.#isStarting = false;

            this.#serverLogger.logger("error","サーバー起動中にエラーが発生しました。");

            if(error instanceof Error){
                this.#serverLogger.logger("error",error.message);
                this.#innerEventBus.emit("server/start:error",{error});
            }else{
                this.#innerEventBus.emit("server/start:error",{});
            }

            throw error;
        }

    }
    #isStopServer:boolean = false;
    async stopServer():Promise<void>{
        const server = this.#httpServer;
        if (!server) return;

        if(this.#isStopServer) return;
        this.#isStopServer = true;

        return new Promise<void>((resolve,reject)=>{
            let settled = false;
            const finish = () => {
                if (settled) return;
                settled = true;

                clearTimeout(timeout);
                this.#isStopServer = false;
                this.#httpServer = null;
            };
            this.#serverLogger.logger("process","終了処理を開始しました...");
            this.#innerEventBus.emit("server/stop:process",{});

            const timeout = setTimeout(() => {
                if (settled) return;

                server?.closeAllConnections();
                this.#serverLogger.logger("warn","タイムアウトしました。");
                this.#innerEventBus.emit("server/stop:timeout",{});

                finish();
                resolve();
            }, 10000);

            server?.close((error)=>{
                if (settled) return;

                if(error){
                    this.#serverLogger.logger("error","サーバー終了中にエラーが発生しました");
                    this.#innerEventBus.emit("server/stop:error",{});

                    finish();
                    reject(error);
                    return;
                };

                this.#serverLogger.logger("success","サーバー終了しました。");
                this.#innerEventBus.emit("server/stop:success",{});

                finish();
                resolve();
            });
            server?.closeIdleConnections();
        });
    }

    // Event登録
    onEvent<Key extends keyof OutEventBusMap>(type:Key,fn:EventBusHandler<OutEventBusMap[Key]>){
        return this.#outEventBus.on(type,fn);
    }
    // Event一度のみ起動
    onceEvent<Key extends keyof OutEventBusMap>(type:Key,fn:EventBusHandler<OutEventBusMap[Key]>){
        return this.#outEventBus.once(type,fn);
    }
    // Event消去
    offEvent<Key extends keyof OutEventBusMap>(type:Key,fn:EventBusHandler<OutEventBusMap[Key]>){
        this.#outEventBus.off(type,fn);
    }
    // Eventが存在するか？
    hasEventt<Key extends keyof OutEventBusMap>(type:Key){
        return this.#outEventBus.has(type);
    }

    // API登録
    onAPI<Key extends keyof RequestEventMap<RequestNameList>>(type:Key,fn:ApiRegistryHandler<RequestEventMap<RequestNameList>[Key]>){
        return this.#serverAPIs.on(type,fn);
    }
    // API一度のみ起動
    onceAPI<Key extends keyof RequestEventMap<RequestNameList>>(type:Key,fn:ApiRegistryHandler<RequestEventMap<RequestNameList>[Key]>){
        return this.#serverAPIs.once(type,fn);
    }
    // API消去
    offAPI<Key extends keyof RequestEventMap<RequestNameList>>(type:Key){
        this.#serverAPIs.off(type);
    }
    // APIが存在するか？
    hasAPI<Key extends keyof RequestEventMap<RequestNameList>>(type:Key){
        return this.#serverAPIs.has(type);
    }
    // API手動実行
    emitAPI<Key extends keyof RequestEventMap<RequestNameList>>(type:Key,data:RequestEventMap<RequestNameList>[Key]){
        return this.#serverAPIs.emit(type,data);
    }
    // サーバー起動中か？
    isRunning():boolean{
        return this.#httpServer !== null;
    }
    // サーバーポート取得
    getPort():number{
        return this.#serverPort;
    }
    // HTTPサーバー取得
    getHttpServer():http.Server | null{
        return this.#httpServer;
    }
}
