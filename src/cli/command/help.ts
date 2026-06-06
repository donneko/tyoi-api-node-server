import type { CmdMetaData } from "../main.js";
import { logger } from "../../util/logger.js";

export default function serverHelp(data:CmdMetaData){
    logger.bar();
    logger.info("HELP : tyoi-server-cli");
    logger.info(`更新[2026/06/04]:現在使用できるコマンドは以下の通りです。`);
    logger.message(`dev  : 動作確認用の設定で動作確認用サーバーが起動します。`);
    logger.message(`help : 使用できるコマンド一覧が確認できます。`);
    logger.message(`init : 現在いるディレクトリーにテンプレートをコピーします。`);
    logger.message(`run  : 現在のディレクトリーのサーバーを起動します`);
    logger.bar();
}