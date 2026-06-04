import path from "node:path";
import { askInput } from "../../../service/ask-input.js";
import { logger } from "../../../util/logger.js";

export async function getProjectName(
    argProjectName:string | undefined,
    processCwd:string
):Promise<string>{

    let projectName = argProjectName;

    if(!projectName){
        const defaultName = path.basename(processCwd)
        const InputProjectName = await askInput(`Project名を入力してください。デフォルト(${defaultName}) : `)
        projectName = InputProjectName
    }

    if (!/^[a-zA-Z0-9-]+$/.test(projectName)) {
        throw Error("プロジェクト名に使える文字は英数字・- のみです。");
    }

    logger.success("プロジェクト名の検証に成功しました。");
    return projectName;
}

