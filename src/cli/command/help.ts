import type { CmdMetaData } from "../types/tyoi-cli.js";
import { Logger } from "@donneko/tyoi-logger";

export default function serverHelp(data:CmdMetaData){
    const logger = new Logger();

    logger.window({
        title:"help 表示",
        content:[
            logger.createInfo(`現在使用できるコマンドは以下の通りです。\n更新 : [2026/06/07]`),
            logger.createBar(),
            logger.createMessage(`dev    : 動作確認用の設定で動作確認用サーバーが起動します。`),
            logger.createMessage(`help   : 使用できるコマンド一覧が確認できます。`),
            logger.createMessage(`init   : 現在いるディレクトリーにサーバーを作成します`),
            logger.createMessage(`run    : 現在のディレクトリーのサーバーを起動します`),
            logger.createMessage(`create : 新しいフォルダーにサーバーを作成します`),
            logger.createMessage(`config : 現在のディレクトリーに設定ファイルを追加します`),
            logger.createMessage(`info   : "tyoi run" の設定が適用されるの確認結果が表示されます`)
        ]
    });
}