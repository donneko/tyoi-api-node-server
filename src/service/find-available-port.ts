import { isUserRequest } from "../util/is-user-request.js";
import { isPortInUse } from "../util/is-portIn-use.js";
import { logger } from "../util/logger.js";

type FindPortData = {
    startPort: number;
    host:string
    isAutoPort:boolean
}
export async function findAvailablePort(findPortData:FindPortData) {

    const {
        startPort,
        host,
        isAutoPort
    } = findPortData;

    let port = startPort;

    while (await isPortInUse(port,host)) {

        if(isAutoPort){
            port++
            continue;
        }

        logger.bar();
        logger.warn(`ポート[${port}]は使用できませんでした。`);
        const isAllow = await isUserRequest(
            logger._createSystem(
            `代わりにポート[${port + 1}]を使用してもいいですか？`
        ));

        if(!isAllow){
            throw new Error(`ポート[${port}]は使用中です。起動を中止しました。`);
        }

        port++
        logger.info(`ポート[${port}]を使用します`);
    }

    return port;
}
