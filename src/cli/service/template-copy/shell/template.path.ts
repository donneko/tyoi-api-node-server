import path from "node:path";
import { readDirectory } from "../../../../server/server-core/util/read-directory.js";
import { Ask, Logger } from "@donneko/tyoi-logger";
import { isValidTemplate } from "../core/is-valid-template.js";

export async function getTemplatePath(
    templateName: string | undefined,
    base: string,
    templatePath: string
): Promise<string> {
    const readPath = path.join(base, templatePath);
    const templateFiles = await readDirectory(readPath, false);
    const ask = new Ask();
    const logger = new Logger();

    let template = templateName;

    if (template) {
        if (isValidTemplate(template, templateFiles)) {
            return path.join(readPath, template);
        }

        throw new Error(`コピー元のテンプレートが見つかりません: ${template}`);
    }

    template = await ask.select("テンプレートを選択してください", templateFiles);

    if (!template) {
        throw new Error(`コピー元のテンプレートが指定されていません: ${template}`);
    }

    logger.info(`選択されたテンプレート[${template}]`);
    return path.join(readPath, template);
}
