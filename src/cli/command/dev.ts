import { Server } from "../../app/server.js";
import type { CmdMetaData } from "../types/tyoi-cli.js";

type RequestNameList = "GET:/test" | "GET:/test/a" | "GET:/a";

export default async function runDevServer(data:CmdMetaData){
    const mainDirname = data.meta.cli.dirname;

    // サーバー作成
    const devConfig = await import("../../config/tyoi.dev.config.js");
    const server = new Server<RequestNameList>({
        ...devConfig.default,
        ...data.meta.option,
        ...{baseDirname:mainDirname}
    });

    // サーバー起動
    await server.startServer();

}