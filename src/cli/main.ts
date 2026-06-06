import { CommandHandler ,type Data} from "./core/command-handler.js";
import { logger } from "../util/logger.js";
import minimist from "minimist"

import dev from "./command/dev.js";
import create from "./command/create/main.js";
import init from "./command/init/main.js";
import help from "./command/help.js";
import run from "./command/start.js";
import config from "./command/config/main.js";
import info from "./command/info/main.js";
import path from "node:path";

type MetaData = {
    pack:{
        version:string,
        name:string
    },
    cli:{
        cwd:string,
        dirname:string
    },
    option:minimist.ParsedArgs
}

export type CmdMetaData = Data<MetaData>;

function addCommand(cmdHandler:CommandHandler<MetaData>){
    cmdHandler.add("",async (data)=> {
        if(data.meta.option?.version){
            logger.system(data.meta.pack.version);
            return;
        }
        if(data.meta.option?.help){
            help(data);
            return;
        }
        await run(data);
    });

    cmdHandler.add("dev",dev);
    cmdHandler.add("run",run);
    cmdHandler.add("create",create);
    cmdHandler.add("config",config);
    cmdHandler.add("init",init);
    cmdHandler.add("info",info);
    cmdHandler.add("help",help);
}

function getOption(argv:string[]){
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

    return updateArgs
}


function getMetaData(argv:string[]):MetaData{
    return {
        pack:{
            version:"0.0.0",
            name:""
        },
        cli:{
            cwd:process.cwd(),
            dirname:path.join(import.meta.dirname,"../")
        },
        option:getOption(argv)
    }
}

function getOnError(){
    logger.bar();
    logger.warn("未知のコマンドです");
    logger.info("コマンドを探すには help を実行してみてください");
}


export function tyoiCli(){
    const argv = process.argv.slice(2);
    const cmdHandler = new CommandHandler<MetaData>();
    cmdHandler.meta = getMetaData(argv);
    cmdHandler.onError = getOnError;

    addCommand(cmdHandler);

    cmdHandler.run(argv);
}