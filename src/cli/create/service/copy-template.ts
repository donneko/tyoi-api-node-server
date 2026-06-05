import { logger } from "../../../util/logger.js";
import { copyFolder } from "./copy-folder.js";
import fs from "node:fs"

export async function copyTemplate(
    templatePath:string,
    projectPath:string
):Promise<void>{
    if (fs.existsSync(projectPath)) {
        throw Error(`エラー: コピー先がすでに存在するため、安全のために終了します。 (${projectPath})`);
    }

    fs.mkdirSync(templatePath);

    const {error,ok}= await copyFolder(templatePath,projectPath);
    logger.window({
        title:"コピー結果",
        content:[
            ...error.map(m=>logger.createError(m)),
            ...ok.map(m=>logger.createSuccess(m))
        ]
    })
}