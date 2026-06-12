import type { CmdMetaData } from "../../main.js";
import { getTemplatePath } from "./service/template.path.js";
import { getProjectName } from "./service/project-name.js";
import { fixPath } from "./service/fix-path.js";
import { replacePackageJson } from "./service/replace-name.js";
import { showNextSteps } from "./service/next-steps.js";
import copyTemplate from "../../service/template-copy/main.js"

export default async function serverCreate(data:CmdMetaData){

    const mainDirname = data.meta.cli.dirname;
    const processCwd  = data.meta.cli.cwd;

    const option = data.meta.option;
    const projectName = data.args[0];

    const pack = data.meta.pack;

    const TEMPLATE_PASS = "../templates/project";

    const usedProjectName = await copyTemplate(
        {
            target:processCwd,
            base:mainDirname,
            option:{
                template:option?.template,
                projectName:projectName
            },
            pack:{
                version:pack.version,
            },
            app:{
                templatePass:TEMPLATE_PASS
            }
        });

    showNextSteps(usedProjectName.projectName);
}
