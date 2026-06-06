import path from "node:path";
import { askSelect } from "../../../../service/ask-select.js";
import { readDirectory } from "../../../../util/read-directory.js";
import { logger } from "../../../../util/logger.js";


export async function getTemplatePath(
    templateName:string | undefined,
    mainDirname:string
):Promise<string>{
    const readPath = path.join(mainDirname, "../templates/config");
    const templateFiles = await readDirectory(readPath, false);

    let template = templateName;

    if (templateName) {
        if (!templateFiles.includes(templateName)) {
            throw new Error(`コピー元のテンプレートが見つかりません: ${templateName}`);
        }
    }

    if (!templateName) {
        const index = await askSelect({
            message: "選択してください",
            selects: templateFiles
        });

        template = templateFiles[(index === -1)?0:index];
    }

    if(!template){
        throw new Error(`コピー元のテンプレートが指定されていません: ${templateName}`);
    }

    logger.info(`選択されたテンプレート[${template}]`);
    return path.join(readPath,template);
}
