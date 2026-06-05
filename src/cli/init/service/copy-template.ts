import { logger } from "../../../util/logger.js";
import { copyFolder } from "./copy-folder.js";

export async function copyTemplate(
    templatePath:string,
    projectPath:string
):Promise<void>{

    const {error,ok} = await copyFolder(templatePath,projectPath);
    logger.window({
        title:"コピー結果",
        content:[
            ...error.map(m=>logger.createError(m)),
            ...ok.map(m=>logger.createSuccess(m))
        ]
    })
}