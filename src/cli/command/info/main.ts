import path from "node:path";
import type { CmdMetaData } from "../../types/tyoi-cli.js";
import { getConfigFile } from "./service/getConfigFile.js";
import { pathToFileURL } from "node:url";
import { Logger } from "@donneko/tyoi-logger";


async function getConfig(
    processCwd:string,
    mainDirname:string,
    optionArgs:any
):Promise<any>{
    
    const file = await getConfigFile(processCwd);

    let useConfig = {};

    if(file){
        const filePath = path.join(processCwd,file)
        useConfig = await import(pathToFileURL(filePath).href).then((r)=> r.default);
    }

    const config = {
        ...useConfig,
        ...optionArgs,
        ...{baseDirname:file ? processCwd : mainDirname}
    };

    return config;
}

function addLog(
    config:any
){
    const logger = new Logger();

    const logs = [];

    for (const [key, value] of Object.entries(config)) {
        logs.push(`${key} : ${value}`)
    }

    logger.window({
        title:"config info",
        content:[
            ...logs.map(l=>logger.createSystem(l))
        ]
    })
}

export default async function serverCreate(data:CmdMetaData){

    const mainDirname = data.meta.cli.dirname;
    const processCwd  = data.meta.cli.cwd;

    const config = await getConfig(
        processCwd,
        mainDirname,
        data.meta.option.optionArgs,
    );

    addLog(config);
}