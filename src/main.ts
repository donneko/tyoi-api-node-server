#!/usr/bin/env node

import minimist from "minimist"
import { logger } from "./util/logger.js";
import dev from "./cli/dev.js";
import create from "./cli/create/main.js";
import init from "./cli/init/main.js";
import help from "./cli/help.js";
import run from "./cli/start.js";
import config from "./cli/config/main.js";
import info from "./cli/info/main.js";

export type MainContextData = {
    mainDirname:string;
    commandArgs:string[];
    optionArgs:minimist.ParsedArgs;
    processCwd:string;
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

    const {open:openBrowser,...tmp} = args;
    const updateArgs = args.open?{openBrowser,...tmp}:args;

    const mainContextData:MainContextData = {
        mainDirname:import.meta.dirname,
        commandArgs:updateArgs._,
        optionArgs:updateArgs,
        processCwd:process.cwd()
    }

    // 実行
    switch(args._[0]?.toLowerCase() ?? ""){
        case "":

            if(mainContextData.optionArgs?.version){
                logger.system("v0.0.5-alpha")
                break;
            }
            if(mainContextData.optionArgs?.help){
                help(mainContextData);
                break;
            }
            await run(mainContextData);
        break;
        case "dev":
            await dev(mainContextData);
        break;
        case "run":
            await run(mainContextData);
        break;
        case "create":
            await create(mainContextData);
        break;
        case "config":
            await config(mainContextData);
        break;
        case "init":
            await init(mainContextData);
        break;
        case "info":
            await info(mainContextData);
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

