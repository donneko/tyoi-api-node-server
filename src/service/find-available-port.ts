import { isUserRequest } from "../util/is-user-request.js";
import { isPortInUse } from "../util/is-portIn-use.js";
import { type ServicesRegister } from "../util/services-register.js";
import { type ServerServicesRegister } from "../app/server.js"


type FindPortData = {
    startPort: number;
    host:string;
    isAutoPort:boolean;
    servicesRegister:ServicesRegister<ServerServicesRegister>;
}
export async function findAvailablePort(findPortData:FindPortData) {

    const {
        startPort,
        host,
        isAutoPort,
        servicesRegister
    } = findPortData;

    const serverLogger = servicesRegister.get("serverLogger");

    let port = startPort;

    while (await isPortInUse(port,host)) {

        if(isAutoPort){
            port++
            continue;
        }

        serverLogger.logger("bar");
        serverLogger.logger("warn",`ポート[${port}]は使用できませんでした。`);

        const isAllow = await isUserRequest(
            serverLogger.logger("createSystem",
            `代わりにポート[${port + 1}]を使用してもいいですか？`
        ).createMessage);

        if(!isAllow){
            throw new Error(`ポート[${port}]は使用中です。起動を中止しました。`);
        }

        port++
        serverLogger.logger("info",`ポート[${port}]を使用します`);
    }

    return port;
}
