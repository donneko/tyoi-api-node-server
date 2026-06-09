import { getTemplatePath } from "../shell/template.path.js";
import { getProjectName } from "../shell/project-name.js";
import { copyTemplate } from "../shell/copy-template.js";
import { replacePackageJson } from "../shell/replace-name.js";


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


    await copyTemplate(
        templatePath,
        base
    );

    replacePackageJson(
        base,
        fixProjectName,
        pack.version
    );
}
