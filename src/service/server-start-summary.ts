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

    // LAN設定
    const isLAN = host === "0.0.0.0";
    const ip = getLanIp();
    const networkUrl = `http://${ip}:${port}`;


    // ログ系
    serverLogger.logger("window",{
        title:"summary",
        content:[
            serverLogger.logger("success","サーバーは起動しました"),
            serverLogger.logger("info",`Port: ${port}`),
            serverLogger.logger("info",`Local: http://localhost:${port}`),
            ...(isLAN ? [serverLogger.logger("info",`Network :${networkUrl}`)] : []),
            serverLogger.logger("info",`public full: ${publicFullPath}`),
            serverLogger.logger("info",`Public: ${publicPath}`),
            serverLogger.logger("info",`API: ${apiPrefix}`),
        ]
    })

    // QRcode生成
    if(isShowQrCode && isLAN){
        serverLogger.logger("window",{
            title:"QRcode",
            content:[
                serverLogger.logger("info","Network URL QRcode"),
                serverLogger.logger("info",(() => {
                    let qrString = "";
                    qrcode.generate(networkUrl, {small: true},(qr)=>{qrString = qr});
                    return qrString;
                })())
            ]
        });
    }
}
