import fs from "node:fs"
import { readDirectory } from "../../../util/read-directory.js"
import path from "node:path";

export async function copyFolder(
    templatePath:string,
    projectPath:string
):Promise<{error:string[],ok:string[]}>{

    const items = await readDirectory(templatePath,true);
    const error = [];
    const ok    = [];

    for (const item of items) {
        const templateItem = path.join(templatePath,item);
        const projectItem = path.join(projectPath,item);

        if(fs.existsSync(projectItem)){
            error.push(projectItem);
            continue;
        }

        fs.copyFileSync(templateItem,projectItem);
        ok.push(projectItem);
    }

    return {error,ok}
}