import { Server } from "../app/server.js";
import type { MainContextData } from "../main.js"

type RequestNameList = "GET:/test" | "GET:/test/a" | "GET:/a";

export default async function runDevServer(mainContextData:MainContextData){
    // サーバー作成
    const config = await import("../config/tyoi.dev.config.js");
    const server = new Server<RequestNameList>({
        ...config.default,
        ...mainContextData.optionArgs,
        ...{baseUrl:mainContextData.mainUrl}
    });

    // サーバー起動
    await server.startServer();

}