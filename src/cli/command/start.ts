import path from "node:path";
import { pathToFileURL } from "node:url";
import type { CmdMetaData } from "../types/tyoi-cli.js";
import { askSelect } from "../../service/ask-select.js";
import { scanConfigFiles } from "../../service/scan-config-files.js";
import { serverRuntime } from "../../process/main-process/main-process.js";

async function getConfigFile(processCwd: string): Promise<string | null | undefined> {
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

export default async function runStartServer(data: CmdMetaData) {
    const cwd = data.meta.cli.cwd;
    const dirname = data.meta.cli.dirname;

    const file = await getConfigFile(cwd);
    let useConfigPath: string = "";

    if (file) {
        const filePath = path.join(cwd, file);
        useConfigPath = pathToFileURL(filePath).href;
    }

    const configOption = {
        ...data.meta.option,
        ...{ baseDirname: file ? cwd : dirname },
    };

    await serverRuntime(useConfigPath, configOption);
}
