import minimist from "minimist"
import { logger } from "./util/logger.js";
import dev from "./cli/dev.js";
import init from "./cli/init.js";

export type MainContextData = {
    mainUrl:string;
    mainDirname:string;
    commandArgs:string[];
    optionArgs:minimist.ParsedArgs;
}

async function tyoiServer(argv:string[]):Promise<void>{

    // コマンド解析
    const args = minimist(argv,{
        alias: {
            p: "port",
            o: "open"
        },

        boolean: [
            "open"
        ]
    });

    const mainContextData:MainContextData = {
        mainUrl:import.meta.url,
        mainDirname:import.meta.dirname,
        commandArgs:args._,
        optionArgs:args,
    }

    // 実行
    switch(args._[0] ?? ""){
        case "":
            await dev(mainContextData);
        break;
        case "dev":
            await dev(mainContextData);
        break;
        case "init":
            init(mainContextData);
        break;
        default:
            logger.bar();
            logger.warn("未知のコマンドです");
        break;
    }
}

tyoiServer(process.argv.slice(2));

