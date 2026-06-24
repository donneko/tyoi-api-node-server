import { askSelect } from "../../../../service/ask-select.js";
import { scanConfigFiles } from "../../../../service/scan-config-files.js";

export async function getConfigFile(processCwd: string): Promise<string | null | undefined> {
    const files = await scanConfigFiles(processCwd);

    if (files.length === 0) return null;

    if (files.length > 1) {
        const index = await askSelect({
            message: "使用する設定ファイルを選択してください。",
            selects: files,
        });
        return index === -1 ? null : files[index];
    }

    return files[0];
}
