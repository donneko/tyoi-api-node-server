import { Logger } from "@donneko/tyoi-logger";

export function getOnError(){
    const logger = new Logger();

    logger.bar();
    logger.warn("未知のコマンドです");
    logger.info("コマンドを探すには help を実行してみてください");
}
