import path from "node:path";
import { Ask, Logger } from "@donneko/tyoi-logger";
import { isValidProjectName } from "../core/is-valid-project-name.js";

export async function getProjectName(
    inputName: string | undefined,
    target: string
): Promise<string> {
    let projectName = inputName;
    const ask = new Ask();
    const logger = new Logger();

    if (!projectName) {
        const defaultName = path.basename(target);
        const InputProjectName =
            (await ask.input(`Project名を入力してください。デフォルト(${defaultName}) : `)) ??
            defaultName;

        projectName = InputProjectName;
    }

    if (!isValidProjectName(projectName)) {
        throw Error(`プロジェクト名に使える文字は英数字・- のみです。[${projectName}]`);
    }

    logger.info(`選択されたプロジェクト名[${projectName}]`);
    return projectName;
}
