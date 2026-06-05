import path from "node:path";
import type { MainContextData } from "../../main.js";
import { getConfigFile } from "./service/getConfigFile.js";
import { pathToFileURL } from "node:url";
import { logger } from "../../util/logger.js";


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

export default async function serverCreate(mainContextData:MainContextData){

    const mainDirname = mainContextData.mainDirname;
    const processCwd = mainContextData.processCwd

    const config = await getConfig(
        processCwd,
        mainDirname,
        mainContextData.optionArgs
    );

    addLog(config);
}