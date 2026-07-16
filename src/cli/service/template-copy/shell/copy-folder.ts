import fs from "node:fs";
import path from "node:path";

function copy(
    templatePath: string,
    projectPath: string,
    { error = [], ok = [] }: { error?: string[]; ok?: string[] } = {}
) {
    const items = fs.readdirSync(templatePath, { withFileTypes: true });
    for (const item of items) {
        const templateItem = path.join(templatePath, item.name);
        // npm は tarball から `.gitignore` を除外するため、テンプレート内では
        // `_gitignore` として保持し、生成時に本来の名前へ戻す。
        const itemName = item.name === "_gitignore" ? ".gitignore" : item.name;
        const projectItem = path.join(projectPath, itemName);
        try {
            if (item.isDirectory()) {
                fs.mkdirSync(projectItem);
                copy(templateItem, projectItem, { error, ok });
            } else {
                fs.copyFileSync(templateItem, projectItem);
            }
            ok.push(projectItem);
        } catch (e) {
            error.push(projectItem);
            throw e;
        }
    }
    return { error, ok };
}

export async function copyFolder(
    templatePath: string,
    projectPath: string
): Promise<{ error: string[]; ok: string[] }> {
    return copy(templatePath, projectPath);
}
