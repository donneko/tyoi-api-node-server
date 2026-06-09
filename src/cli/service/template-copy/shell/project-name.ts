import path from "node:path";
import { askInput } from "../../../../service/ask-input.js";
import { logger } from "../../../../util/logger.js";
import { isValidProjectName } from "../core/is-valid-project-name.js";

export async function getProjectName(
    inputName:string | undefined,
    target:string
):Promise<string>{

    let projectName = inputName;

    if(!projectName){
        const defaultName = path.basename(target);
        const InputProjectName = await askInput(
                `Project名を入力してください。デフォルト(${defaultName}) : `
            ) ?? defaultName;

        projectName = InputProjectName
    }

    if (!isValidProjectName(projectName)){
        throw Error(`プロジェクト名に使える文字は英数字・- のみです。[${projectName}]`);
    }

    logger.info(`選択されたプロジェクト名[${projectName}]`);
    return projectName;
}

