import { isUserRequest } from "../util/is-user-request.js";
import { isPortInUse } from "../util/is-portIn-use.js";

export async function findAvailablePort(startPort: number,host:string) {
    let port = startPort;
    while (await isPortInUse(port,host)) {
        const isAllow = await isUserRequest(`指定されたポート[${port}]は使用できませんでした。代わりにポート[${port + 1}]を使用してもいいですか？`);
        if(!isAllow)break;

        port++
    }

    return port;
}