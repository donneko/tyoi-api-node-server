import fs from "node:fs"

export function copyTemplate(
    templatePath:string,
    projectPath:string
):void{

    if (fs.existsSync(projectPath)) {
        throw Error(`エラー: コピー先がすでに存在するため、安全のために終了します。 (${projectPath})`);
    }

    fs.cpSync(templatePath, projectPath, {
        recursive: true
    });
}
