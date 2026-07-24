import path from "node:path";
import { pathToFileURL } from "node:url";
import { Ask } from "@donneko/tyoi-logger";
import type { CmdMetaData } from "../types/tyoi-cli.type.js";
import { scanConfigFiles } from "../service/scan-config-files.js";
import { serverRuntime } from "../../process/main-process/main-process.js";

async function getConfigFile(processCwd: string): Promise<string | undefined> {
    const files = await scanConfigFiles(processCwd);

    if (files.length === 0) return;

    if (files.length > 1) {
        return await new Ask().select("使用する設定ファイルを選択してください。", files);
    }
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
