import fs from "node:fs"
import path from "node:path";

function copy(
    templatePath:string,
    projectPath:string,
    {
        error =[],
        ok    = []
    }:{error?:string[],ok?:string[]} = {}
){

    const items = fs.readdirSync(templatePath,{withFileTypes:true});
    for (const item of items) {
        const templateItem = path.join(templatePath,item.name);
        const projectItem = path.join(projectPath,item.name);
        try {
            if(item.isFile()){
                fs.mkdirSync(projectItem);
                copy(
                    templateItem,
                    projectItem,
                    {error,ok}
                )
            }else{
                fs.copyFileSync(templateItem,projectItem);
            }
            ok.push(projectItem);
        } catch {
            error.push(projectItem);
        }
    }
    return {error,ok};
}

export async function copyFolder(
    templatePath:string,
    projectPath:string
):Promise<{error:string[],ok:string[]}>{


    return copy(
        templatePath,
        projectPath
    );
}