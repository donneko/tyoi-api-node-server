import { CommandHandler ,type Data} from "./core/command-handler.js";
import { logger } from "../util/logger.js";
import minimist from "minimist"

import dev from "./cli/dev.js";
import create from "./cli/create/main.js";
import init from "./cli/init/main.js";
import help from "./cli/help.js";
import run from "./cli/start.js";
import config from "./cli/config/main.js";
import info from "./cli/info/main.js";

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
            dirname:import.meta.dirname
        },
        option:getOption(argv)
    }
}

function getOnError(){
    logger.bar();
    logger.warn("未知のコマンドです");
    logger.info("コマンドを探すには help を実行してみてください");
}


export function command(argv:string[]){
    const cmdHandler = new CommandHandler<MetaData>();
    cmdHandler.meta = getMetaData(argv);
    cmdHandler.onError = getOnError;

    addCommand(cmdHandler);

    run(argv);
}