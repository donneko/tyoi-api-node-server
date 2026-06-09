import { logger } from "../../../../util/logger.js";
import { copyFolder } from "./copy-folder.js";
import { createCopyResult } from "./create-copy-result.js";


export async function copyTemplate(
    templatePath:string,
    projectPath:string
):Promise<void>{

    const copyResult= await copyFolder(templatePath,projectPath);
    logger.window(
        createCopyResult(copyResult)
    );
}