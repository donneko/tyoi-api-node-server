import express from "express";
import http from "node:http";
import { pathNormalization } from "../service/path-normalization.js";
import { ApiRegistry , ApiRegistryHandler} from "../util/api-registry.js";

type RequestData = {
    query  : unknown,
    body   : unknown,
    params : unknown,
    headers: unknown
}
type RequestEventMap<L extends string> = {
    [N in L]: RequestData;
}

type inputConfigData = {
    baseUrl:string;
    publicDirname:string;
    port:number;
}
type ServerOptions = {
    baseUrl: string;
    publicDirname: string;
    apiPrefix?: string;
    port?: number;
    middlewares?: express.RequestHandler[];
};

export class Server<RequestNameList extends string>
{
    #appServer = express();
    #publicDirectoryPath!:string;
    #serverPort!:number;
    #serverAPIs = new ApiRegistry<RequestEventMap<RequestNameList>>();
    #httpServer: http.Server | null = null;

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

        const {
            baseUrl,
            publicDirname = "main",
            apiPrefix = "/api",
            port = 3000,
            middlewares = []
        } = options;

        this.#init({baseUrl,publicDirname,port})
        this.#initServer(middlewares,apiPrefix);
    }

    // サーバー作成前の設定
    #init(data:inputConfigData){
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
            params: req.params,
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

    // サーバーの起動
    startServer(){
        const port = this.#serverPort;

        this.#httpServer = this.#appServer.listen(port, () => {
            console.log(`Server: http://localhost:${port}`);
        });

        return this.#httpServer;
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
                    return;
                }

                this.#httpServer = null;
                resolve();
            });

        });
    }

    // API登録
    onAPI<Key extends keyof RequestEventMap<RequestNameList>>(type:Key,fn:ApiRegistryHandler<RequestEventMap<RequestNameList>[Key]>){
        this.#serverAPIs.on(type,fn);
    }
    // API一度のみ起動
    onceAPI<Key extends keyof RequestEventMap<RequestNameList>>(type:Key,fn:ApiRegistryHandler<RequestEventMap<RequestNameList>[Key]>){
        this.#serverAPIs.once(type,fn);
    }
    // API消去
    offAPI<Key extends keyof RequestEventMap<RequestNameList>>(type:Key){
        this.#serverAPIs.off(type);
    }
    // APIが存在するか？
    hasAPI<Key extends keyof RequestEventMap<RequestNameList>>(type:Key){
        return this.#serverAPIs.has(type);
    }
        // TODO 他の制御用関数を作成する。
}