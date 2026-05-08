import minimist from "minimist"
import { Server } from "./app/server.js";

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
            ( async () => {
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
            ( async () => {
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
    }
}

tyoiServer(process.argv.slice(2));

