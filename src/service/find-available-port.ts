import { isUserRequest } from "../util/is-user-request.js";
import { isPortInUse } from "../util/is-portIn-use.js";
import { logger } from "../util/logger.js";

export async function findAvailablePort(startPort: number,host:string) {
    let port = startPort;

    while (await isPortInUse(port,host)) {
        logger.bar();
        logger.warn(`指定されたポート[${port}]は使用できませんでした。`);
        const isAllow = await isUserRequest(
            logger._createSystem(
            `代わりにポート[${port + 1}]を使用してもいいですか？`
        ));

        if(!isAllow){
            throw new Error(`指定されたポート[${port}]は使用中です。起動を中止しました。`);
        }

        port++
        logger.info(`ポート[${port}]を使用します`);
    }

    return port;
}
