import express from "express";
import { pathNormalization } from "../service/path-normalization.js";

export class Server {
    #appServer = express();
    #publicDirectoryPath;
    #serverPort;

    /**
     * expressを使用した簡単なサーバーを作れるようにします。
     * @param baseUrl ベースのファイルURL
     * @param publicDirname public内で公開するディレクトリ名
     * @param port 公開ポート
     * @example
     * new Server(import.meta.url,"main",3000);
     */
    constructor(baseUrl,publicDirname,port){
        this.#init({baseUrl,publicDirname,port})
        this.#initServer();
    }
    // サーバー作成前の設定
    #init(data){
        const {baseUrl,publicDirname,port} = data;

        this.#publicDirectoryPath = pathNormalization(baseUrl,publicDirname);
        this.#serverPort = port;
    }

    // サーバー作成
    #initServer(){

        // JSONを受け取れるようにする
        this.#appServer.use(express.json());

        // API
        // TODO apiの登録した中から参照して実行結果を返す。関数を作成する。

        // 静的ファイル配信
        this.#appServer.use(express.static(this.#publicDirectoryPath));
    }

    // サーバーの作成
    startServer(){
        const port = this.#serverPort;

        return this.#appServer.listen(port, () => {
            console.log(`Server: http://localhost:${port}`);
        });
    }

        // TODO 他の制御用関数を作成する。
}