import { getTemplatePath } from "../shell/template.path.js";
import { getProjectName } from "../shell/project-name.js";
import { replacePackageJson } from "../shell/replace-name.js";
import { copyFolder } from "../shell/copy-folder.js";
import { createCopyResult } from "../shell/create-copy-result.js";
import fs from "node:fs";
import path from "node:path";

import { Logger } from "@donneko/tyoi-logger";

type AppTemplateCopyDestination = "target" | "target-project";

export type AppTemplateCopyData = {
    target: string;
    base: string;
    option: {
        template?: string;
        projectName?: string;
    };
    pack: {
        version: string;
    };
    app: {
        templatePass: string;
        destination?: AppTemplateCopyDestination;
        replacePackageJson?: boolean;
    };
};
export type AppTemplateCopyReturn = {
    projectName: string;
};

function getProjectPath(
    target: string,
    projectName: string,
    destination: AppTemplateCopyDestination
): string {
    if (destination === "target-project") {
        return path.join(target, projectName);
    }

    return target;
}

function createProjectDirectory(
    projectPath: string,
    destination: AppTemplateCopyDestination
): void {
    if (destination !== "target-project") return;

    if (fs.existsSync(projectPath)) {
        throw Error(
            `エラー: コピー先がすでに存在するため、安全のために終了します。 (${projectPath})`
        );
    }

    fs.mkdirSync(projectPath);
}

export async function appTemplateCopy(data: AppTemplateCopyData): Promise<AppTemplateCopyReturn> {
    const { target, base, option, pack, app } = data;

    const { template, projectName } = option;
    const logger = new Logger();

    const templatePath = await getTemplatePath(template, base, app.templatePass);

    const fixProjectName = await getProjectName(projectName, target);

    const destination = app.destination ?? "target";
    const projectPath = getProjectPath(target, fixProjectName, destination);

    createProjectDirectory(projectPath, destination);

    const copyResult = await copyFolder(templatePath, projectPath);
    logger.window(...createCopyResult(copyResult));

    if (app.replacePackageJson ?? true) {
        replacePackageJson(projectPath, fixProjectName, pack.version);
    }

    return {
        projectName: fixProjectName,
    };
}
