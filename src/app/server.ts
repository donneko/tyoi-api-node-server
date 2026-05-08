import express from "express";
import http from "node:http";

import TYOI_DEFAULT_CONFIG from "../config/tyoi.default.config.js"
import { pathNormalization } from "../service/path-normalization.js";
import { ApiRegistry , ApiRegistryHandler} from "../util/api-registry.js";
import { logger } from "../util/logger.js";
import { findAvailablePort } from "../service/find-available-port.js";
import type { ServerDefaultConfig,ServerUserConfig } from "../types/config.type.js"
import { serverStartSummary } from "../service/server-start-summary.js";


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
};
type initConfigData = {
    baseUrl:string;
    publicDirname:string;
    port:number;
}
type ServerOptions = ServerUserConfig & {
    baseUrl: string;
}

type ServerConfig = {
    baseUrl: string;
    publicDirname: string;
    apiPrefix: string;
    port: number;
    middlewares: express.RequestHandler[];
    exposeLan: boolean,
    showQrCode: boolean,
}

export class Server<RequestNameList extends string>
{
    #appServer = express();
    #publicDirectoryPath!:string;
    #serverPort!:number;
    #serverAPIs = new ApiRegistry<RequestEventMap<RequestNameList>>();
    #httpServer: http.Server | null = null;
    #SERVER_DEFAULT_CONFIG:ServerDefaultConfig = TYOI_DEFAULT_CONFIG;
    #serverConfig!:ServerConfig;

    /**
     * expressを使用した簡単なサーバーを作れるようにします。
     * @param baseUrl ベースのファイルURL
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
     *      baseUrl:import.meta.url,
     *      publicDirname:"main",
     *      apiPrefix:"/api",
     *      port:3000,
     *      middlewares:[
     *          morgan("dev")
     *      ]
     *  });
     *
     *  server.startServer();
     *  server.onAPI("GET:/a",(data)=>{
     *      return data;
     *  })
     */
    constructor(options:ServerOptions){

        this.#serverConfig = {...this.#SERVER_DEFAULT_CONFIG,...options};
        const {
            baseUrl,
            publicDirname = "main",
            apiPrefix = "/api",
            port = 3000,
            middlewares = []
        } = this.#serverConfig;

        this.#init({baseUrl,publicDirname,port})
        this.#initServer(middlewares,apiPrefix);
    }

    // サーバー作成前の設定
    #init(data:initConfigData){
        const {baseUrl,publicDirname,port} = data;

        this.#publicDirectoryPath = pathNormalization(baseUrl,publicDirname);
        this.#serverPort = port;
    }

    // サーバー作成
    #initServer(middlewares:express.RequestHandler[],apiPrefix:string){

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
            const startServerOptions = {...this.#serverConfig,...options};

            // ホスト設定
            const host = startServerOptions.exposeLan ? "0.0.0.0" : "127.0.0.1";

            // ポート設定
            // MEMO constructorで設定した値がデフォルトで上書きされる可能性があるから、ifはoptionsで比較
            if(options?.port !== undefined)this.#serverPort = options.port;
            this.#serverPort = await findAvailablePort(this.#serverPort,host);
            const port = this.#serverPort;

            // サーバー起動処理
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
                apiPrefix:startServerOptions.apiPrefix,
                isShowQrCode:startServerOptions.showQrCode,
            });

            return httpServer;

        } catch (error) {
            logger.error("サーバー起動中にエラーが発生しました。");
            if(error instanceof Error){
                logger.error(error.message);
            }
            throw error;
        }

    }
    stopServer(){
        return new Promise<void>((resolve,reject)=>{
            if(!this.#httpServer){
                resolve();
                return;
            }

            this.#httpServer?.close((error)=>{

                if(error){
                    reject(error);
                    logger.error("サーバー終了中にエラーが発生しました");
                    return;
                }

                this.#httpServer = null;
                logger.info("正常にサーバー終了しました。");
                resolve();
            });

        });
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
