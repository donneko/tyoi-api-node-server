import minimist from "minimist"
import { Server } from "./app/server.js";
import { logger } from "./util/logger.js";

async function tyoiServer(argv:string[]):Promise<void>{
    const args = minimist(argv,{
        alias: {
            p: "port",
            o: "open"
        },

        boolean: [
            "open"
        ]
    });
    type RequestNameList = "GET:/test" | "GET:/test/a" | "GET:/a";

    switch(args._[0] ?? ""){
        case "":
            await ( async () => {
                // サーバー作成
                const config = await import("./config/tyoi.config.js");
                const server = new Server<RequestNameList>({
                    ...config.default,
                    ...args,
                    ...{baseUrl:import.meta.url}
                });

                // サーバー起動
                await server.startServer();
            })();
        break;
        case "dev":
            await ( async () => {
                // サーバー作成
                const config = await import("./config/tyoi.dev.config.js");
                const server = new Server<RequestNameList>({
                    ...config.default,
                    ...args,
                    ...{baseUrl:import.meta.url}
                });

                // サーバー起動
                await server.startServer();
            })();

        break;
        default:
            logger.bar();
            logger.warn("未知のコマンドです");
        break;
    }
}

tyoiServer(process.argv.slice(2));

