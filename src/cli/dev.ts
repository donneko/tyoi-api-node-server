import { Server } from "../app/server.js";
import type { MainContextData } from "../main.js"

type RequestNameList = "GET:/test" | "GET:/test/a" | "GET:/a";

export default async function runDevServer(mainContextData:MainContextData){
    // サーバー作成
    const devConfig = await import("../config/tyoi.dev.config.js");
    const server = new Server<RequestNameList>({
        ...devConfig.default,
        ...mainContextData.optionArgs,
        ...{baseDirname:mainContextData.mainDirname}
    });

    // サーバー起動
    await server.startServer();

}