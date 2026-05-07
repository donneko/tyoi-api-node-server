import express from "express";
import { pathNormalization } from "../service/path-normalization.js";
import { ApiRegistry , ApiRegistryHandler} from "../util/api-registry.js";

type RequestData = {
    query  : unknown,
    body   : unknown,
    params : unknown,
    headers: unknown
}
type RequestNameList = "GET:/test" | "GET:/test/a" | "GET:/a";

type RequestEventMap = {
    [N in RequestNameList]: RequestData;
}


type inputConfigData = {
    baseUrl:string;
    publicDirname:string;
    port:number;
}
export class Server {
    #appServer = express();
    #publicDirectoryPath!:string;
    #serverPort!:number;
    #serverAPIs = new ApiRegistry<RequestEventMap>();

    /**
     * expressを使用した簡単なサーバーを作れるようにします。
     * @param baseUrl ベースのファイルURL
     * @param publicDirname public内で公開するディレクトリ名
     * @param port 公開ポート
     * @example
     * new Server(import.meta.url,"main",3000);
     */
    constructor(baseUrl:string,publicDirname:string,port:number){
        this.#init({baseUrl,publicDirname,port})
        this.#initServer();
    }
    // サーバー作成前の設定
    #init(data:inputConfigData){
        const {baseUrl,publicDirname,port} = data;

        this.#publicDirectoryPath = pathNormalization(baseUrl,publicDirname);
        this.#serverPort = port;
    }

    // サーバー作成
    #initServer(){

        // JSONを受け取れるようにする
        this.#appServer.use(express.json());

        // API
        this.#appServer.use("/api", (req, res) => {
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
                    error: "API NOT FOUND"
                });
                return;
            }

            const result = await this.#serverAPIs.emit(key, {
            query: req.query,
            body: req.body,
            params: req.params,
            headers: req.headers
            });

            res.json(result);
        } catch (error) {
            res.status(500).json({
                error: "API ERROR"
            });
        }
    };

    // サーバーの起動
    startServer(){
        const port = this.#serverPort;

        return this.#appServer.listen(port, () => {
            console.log(`Server: http://localhost:${port}`);
        });
    }

    // API登録
    onAPI<Key extends keyof RequestEventMap>(type:Key,fn:ApiRegistryHandler<RequestEventMap[Key]>){
        this.#serverAPIs.on(type,fn);
    }
    // API一度のみ起動
    onceAPI<Key extends keyof RequestEventMap>(type:Key,fn:ApiRegistryHandler<RequestEventMap[Key]>){
        this.#serverAPIs.once(type,fn);
    }
    // API消去
    offAPI<Key extends keyof RequestEventMap>(type:Key){
        this.#serverAPIs.off(type);
    }
    // APIが存在するか？
    hasAPI<Key extends keyof RequestEventMap>(type:Key){
        return this.#serverAPIs.has(type);
    }
        // TODO 他の制御用関数を作成する。
}