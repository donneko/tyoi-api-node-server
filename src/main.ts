import minimist from "minimist"
import { logger } from "./util/logger.js";
import dev from "./cli/dev.js";
import init from "./cli/init.js";
import help from "./cli/help.js";

export type MainContextData = {
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
        ],

        string: [
            "template"
        ]
    });

    const mainContextData:MainContextData = {
        mainDirname:import.meta.dirname,
        commandArgs:args._,
        optionArgs:args,
    }

    // TODO 後で別のプロジェクトで作成したコマンド実行する関数に変える。

    // 実行
    switch(args._[0]?.toLowerCase() ?? ""){
        case "":
            await dev(mainContextData);
        break;
        case "dev":
            await dev(mainContextData);
        break;
        case "init":
            init(mainContextData);
        break;
        case "help":
            help(mainContextData);
        break;
        default:
            logger.bar();
            logger.warn("未知のコマンドです");
        break;
    }
}

tyoiServer(process.argv.slice(2));

