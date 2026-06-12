import { getTemplatePath } from "../shell/template.path.js";
import { getProjectName } from "../shell/project-name.js";
import { replacePackageJson } from "../shell/replace-name.js";
import { copyFolder } from "../shell/copy-folder.js";
import { createCopyResult } from "../shell/create-copy-result.js";

import { logger } from "../../../../util/logger.js";


export type AppTemplateCopyData = {
    target:string,
    base:string,
    option:{
        template?:string,
        projectName?:string
    },
    pack:{
        version:string,
    },
    app:{
        templatePass:string
    }
}

export async function appTemplateCopy(
    data:AppTemplateCopyData
){
    const {
        target,
        base,
        option,
        pack,
        app
    } = data;

    const {
        template,
        projectName
    } = option;


    const templatePath = await getTemplatePath(
        template,
        base,
        app.templatePass
    );

    const fixProjectName = await getProjectName(
        projectName,
        target
    );

    const copyResult = await copyFolder(templatePath,base);
    logger.window(
        createCopyResult(copyResult)
    );

    replacePackageJson(
        base,
        fixProjectName,
        pack.version
    );
}
