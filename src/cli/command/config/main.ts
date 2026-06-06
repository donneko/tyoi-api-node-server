import type { CmdMetaData } from "../../main.js";
import { getTemplatePath } from "./service/template.path.js";
import { getProjectName } from "./service/project-name.js";
import { copyTemplate } from "./service/copy-template.js";
import { replacePackageJson } from "./service/replace-name.js";
import { showNextSteps } from "./service/next-steps.js";


export default async function serverConfig(data:CmdMetaData){

    const mainDirname = data.meta.cli.dirname;
    const processCwd  = data.meta.cli.cwd;

    const templatePass = await getTemplatePath(
        data.meta.option.optionArgs?.template,
        mainDirname
    );

    const projectName = await getProjectName(
        data.args[0],
        processCwd
    );

    const templatePath = templatePass;
    const projectPath  = processCwd;


    await copyTemplate(
        templatePath,
        projectPath
    );

    replacePackageJson(
        projectPath,
        projectName
    );

    showNextSteps();
}
