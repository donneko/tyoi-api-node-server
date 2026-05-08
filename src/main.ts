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

    switch(args._[0]){
        case "dev":
            const config = await import("./config/tyoi.dev.config.js");
            const server = new Server<RequestNameList>({
                ...config.default,
                ...args,
                ...{baseUrl:import.meta.url}
            });
            await server.startServer();

            server.onAPI("GET:/a",(data)=>{
                return data;
            });

        break;
        default:
            logger.bar();
            logger.warn("コマンドが存在しませんでした。");
    }
}

tyoiServer(process.argv.slice(2));

