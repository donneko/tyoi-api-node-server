import qrcode from "qrcode-terminal";
import type { ServerStartSummaryDependencies } from "../../../types/server-dependencies.type.js";
import type { ServerStartSummaryArgs } from "../../../types/server.type.js";
import { createNetworkData } from "./create-network-data.js";

export function serverSummary(
    summaryData: ServerStartSummaryArgs,
    dependencies: ServerStartSummaryDependencies
): void {
    const { host, port, publicPath, publicFullPath, apiPrefix, showQrCode } = summaryData;
    const { networkUrl, isLAN } = createNetworkData(port, host);

    const serverLogger = dependencies.serverLogger;
    const systemMetaManager = dependencies.systemMetaManager;
    const getMessage = (code: Parameters<typeof systemMetaManager.getMeta>[0]) =>
        systemMetaManager.getMeta(code).message;

    // ステータス
    serverLogger.logger("window", getMessage(121), [
        serverLogger.logger("createSuccess", getMessage(113)),
        serverLogger.logger("createInfo", `${getMessage(114)}${port}`),
        serverLogger.logger("createInfo", `${getMessage(115)}${port}`),
        ...(isLAN ? [serverLogger.logger("createInfo", `${getMessage(116)}${networkUrl}`)] : []),
        serverLogger.logger("createInfo", `${getMessage(117)}${publicFullPath}`),
        serverLogger.logger("createInfo", `${getMessage(118)}${publicPath}`),
        serverLogger.logger("createInfo", `${getMessage(119)}${apiPrefix}`),
    ]);

    // QRcode生成
    if (showQrCode && isLAN) {
        serverLogger.logger("window", getMessage(122), [
            serverLogger.logger("createInfo", systemMetaManager.getMeta(120).message),
            serverLogger.logger(
                "createInfo",
                (() => {
                    let qrString = "";
                    qrcode.generate(networkUrl, { small: true }, (qr) => {
                        qrString = qr;
                    });
                    return qrString;
                })()
            ),
        ]);
    }
}
