import { isUserRequest } from "../util/is-user-request.js";
import { isPortInUse } from "../util/is-portIn-use.js";
import { type ServicesRegister } from "../util/services-register.js";
import { type ServerServicesRegister } from "../app/server.js";

type FindPortData = {
    startPort: number;
    host: string;
    isAutoPort: boolean;
    servicesRegister: ServicesRegister<ServerServicesRegister>;
};
export async function findAvailablePort(findPortData: FindPortData) {
    const { startPort, host, isAutoPort, servicesRegister } = findPortData;

    const serverLogger = servicesRegister.get("serverLogger");

    let port = startPort;

    while (await isPortInUse(port, host)) {
        if (isAutoPort) {
            port++;
            continue;
        }

        serverLogger.logger("bar");
        serverLogger.logger(
            "warn",
            servicesRegister
                .get("systemMetaManager")
                .getMeta(108)
                .message.replace("__PORT__", port.toString())
        );

        const isAllow = await isUserRequest(
            serverLogger.logger(
                "createSystem",
                servicesRegister
                    .get("systemMetaManager")
                    .getMeta(109)
                    .message.replace("__PORT__", (port + 1).toString())
            ).createMessage
        );

        if (!isAllow) {
            throw new Error(
                servicesRegister
                    .get("systemMetaManager")
                    .getMeta(110)
                    .message.replace("__PORT__", port.toString())
            );
        }

        port++;
        serverLogger.logger(
            "info",
            servicesRegister
                .get("systemMetaManager")
                .getMeta(111)
                .message.replace("__PORT__", port.toString())
        );
    }

    return port;
}
