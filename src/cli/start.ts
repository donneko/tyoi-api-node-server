import { Server } from "../app/server.js";
import type { MainContextData } from "../main.js"
import { scanConfigFiles } from "../service/scan-config-files.js";

type RequestNameList = "GET:/test" | "GET:/test/a" | "GET:/a";

export default async function runStartServer(mainContextData:MainContextData){
    scanConfigFiles(mainContextData.processCwd);
    
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