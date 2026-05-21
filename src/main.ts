#!/usr/bin/env node

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
            o: "open",
            v: "version",
            h: "help",
        },

        boolean: [
            "open",
            "version",
            "help"
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

    // 実行
    switch(args._[0]?.toLowerCase() ?? ""){
        case "":

            if(mainContextData.optionArgs?.version){
                logger.system("v0.0.1")
                break;
            }
            if(mainContextData.optionArgs?.help){
                help(mainContextData);
                break;
            }
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
            logger.info("コマンドを探すには help を実行してみてください");
        break;
    }
}

tyoiServer(process.argv.slice(2));

