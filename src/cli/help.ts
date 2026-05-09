import type { MainContextData } from "../main.js";
import { logger } from "../util/logger.js";

export default function serverHelp(mainContextData:MainContextData ){
    logger.bar();
    logger.info("HELP : tyoi-server-cli");
    logger.info(`更新[2026/05/09 / 17:05]:現在使用できるコマンドは以下の通りです。`);
    logger.message(`dev  : デフォルトの設定で動作確認用サーバーが起動します。`);
    logger.message(`help : 使用できるコマンド一覧が確認できます。`);
    logger.message(`init : 現在いるディレクトリーにテンプレートをコピーします。`);
    logger.bar();
}