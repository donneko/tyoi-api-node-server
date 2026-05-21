import qrcode from "qrcode-terminal";

import { getLanIp } from "../util/get-lan-ip.js";
import { type ServicesRegister } from "../util/services-register.js";
import { type ServerServicesRegister } from "../app/server.js"


type SummaryData = {
    host:string;
    port:number;
    publicPath:string;
    publicFullPath:string;
    apiPrefix:string;
    isShowQrCode:boolean;
    servicesRegister:ServicesRegister<ServerServicesRegister>;
}

export function serverStartSummary(summaryData:SummaryData):void{

    const {
        host,
        port,
        publicPath,
        publicFullPath,
        apiPrefix,
        isShowQrCode,
        servicesRegister
    } = summaryData;

    const serverLogger = servicesRegister.get("serverLogger");
    const systemMetaManager = servicesRegister.get("systemMetaManager");

    // LAN設定
    const isLAN = host === "0.0.0.0";
    const ip = getLanIp();
    const networkUrl = `http://${ip}:${port}`;


    // ログ系
    serverLogger.logger("window",{
        title:systemMetaManager.getMeta(121).message,
        content:[
            serverLogger.logger("success",systemMetaManager.getMeta(113).message),
            serverLogger.logger("info",`${systemMetaManager.getMeta(114).message}${port}`),
            serverLogger.logger("info",`${systemMetaManager.getMeta(115).message}${port}`),
            ...(isLAN ? [serverLogger.logger("info",`${systemMetaManager.getMeta(116).message}${networkUrl}`)] : []),
            serverLogger.logger("info",`${systemMetaManager.getMeta(117).message}${publicFullPath}`),
            serverLogger.logger("info",`${systemMetaManager.getMeta(118).message}${publicPath}`),
            serverLogger.logger("info",`${systemMetaManager.getMeta(119).message}${apiPrefix}`),
        ]
    })

    // QRcode生成
    if(isShowQrCode && isLAN){
        serverLogger.logger("window",{
            title:systemMetaManager.getMeta(122).message,
            content:[
                serverLogger.logger("info",systemMetaManager.getMeta(120).message),
                serverLogger.logger("info",(() => {
                    let qrString = "";
                    qrcode.generate(networkUrl, {small: true},(qr)=>{qrString = qr});
                    return qrString;
                })())
            ]
        });
    }
}
