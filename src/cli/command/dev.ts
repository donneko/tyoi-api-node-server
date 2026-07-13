import type { CmdMetaData } from "../types/tyoi-cli.js";
import { serverRuntime } from "../../process/main-process/main-process.js";
import path from "node:path";

export default async function runDevServer(data: CmdMetaData) {
    const mainDirname = data.meta.cli.dirname;

    // 設定パスの作成
    const useConfigPath = path.join(import.meta.dirname, "../../config/tyoi.dev.config.js");

    const configOption = {
        ...data.meta.option,
        ...{ baseDirname: mainDirname },
    };

    // サーバー起動
    await serverRuntime(useConfigPath, configOption);
}
