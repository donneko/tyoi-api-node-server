import qrcode from "qrcode-terminal";

import { getLanIp } from "../util/get-lan-ip.js";
import { logger } from "../util/logger.js";


type SummaryData = {
    host:string;
    port:number;
    publicPath:string;
    publicFullPath:string;
    apiPrefix:string;
    isShowQrCode:boolean;
}

export function serverStartSummary(summaryData:SummaryData):void{

    const {
        host,
        port,
        publicPath,
        publicFullPath,
        apiPrefix,
        isShowQrCode,
    } = summaryData;

    // LAN設定
    const isLAN = host === "0.0.0.0";
    const ip = getLanIp();
    const networkUrl = `http://${ip}:${port}`;


    // ログ系
    logger.bar();
    logger.success("サーバーは起動しました");
    logger.bar();
    logger.info(`Port: ${port}`);
    logger.info(`Local: http://localhost:${port}`);
    if(isLAN) logger.info(`Network :${networkUrl}`);
    logger.info(`public full: ${publicFullPath}`);
    logger.info(`Public: ${publicPath}`);
    logger.info(`API: ${apiPrefix}`);

    // QRcode生成
    if(isShowQrCode && isLAN){
        logger.bar();
        logger.info(`Network URL QRcode`);
        qrcode.generate(networkUrl, {
            small: true
        });
    }
    logger.bar();
}
