import fs from "node:fs"

export function copyTemplate(
    templatePath:string,
    projectPath:string
):void{

    fs.cpSync(templatePath, projectPath, {
        recursive: true
    });
}
