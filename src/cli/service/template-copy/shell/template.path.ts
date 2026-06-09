import path from "node:path";
import { askSelect } from "../../../../service/ask-select.js";
import { readDirectory } from "../../../../util/read-directory.js";
import { logger } from "../../../../util/logger.js";
import { isValidTemplate } from "../core/is-valid-template.js";


export async function getTemplatePath(
    templateName:string | undefined,
    base:string,
    templatePath:string
):Promise<string>{
    const readPath = path.join(base, templatePath);
    const templateFiles = await readDirectory(readPath, false);

    let template = templateName;

    if (
        isValidTemplate(
            template,
            templateFiles
        )
    ){
        if(template) return path.join(readPath,template);
    }

    logger.warn(`テンプレートが見つかりません: ${template}`);
    if (!template) {
        const index = await askSelect({
            message: "テンプレートを選択してください",
            selects: templateFiles
        });

        template = templateFiles[(index === -1)?0:index];
    }

    if(!template){
        throw new Error(`コピー元のテンプレートが指定されていません: ${template}`);
    }

    logger.info(`選択されたテンプレート[${template}]`);
    return path.join(readPath,template);
}
