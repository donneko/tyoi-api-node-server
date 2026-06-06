import type { MainContextData } from "../../main.js";
import { getTemplatePath } from "./service/template.path.js";
import { getProjectName } from "./service/project-name.js";
import { copyTemplate } from "./service/copy-template.js";
import { replacePackageJson } from "./service/replace-name.js";
import { showNextSteps } from "./service/next-steps.js";


export default async function serverConfig(mainContextData:MainContextData){

    const mainDirname = mainContextData.mainDirname;
    const processCwd = mainContextData.processCwd

    const templatePass = await getTemplatePath(
        mainContextData.optionArgs?.template,
        mainDirname
    );

    const projectName = await getProjectName(
        mainContextData.commandArgs[1],
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
