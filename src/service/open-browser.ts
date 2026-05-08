import open from "open";
import { getLanIp } from "../util/get-lan-ip.js";
import type { BrowserOpenConfig } from "../types/config.type.js"
import { logger } from "../util/logger.js";

type OpenBrowserData = {
    host:string;
    port:number;
    target:BrowserOpenConfig
}

export async function openBrowser(openBrowserData:OpenBrowserData):Promise<void>{
    const {
        host,
        port,
        target
    } = openBrowserData;

    const isLAN = host === "0.0.0.0";
    const ip = getLanIp();
    const networkUrl = `http://${ip}:${port}`;

    if((!isLAN && target === "network")) logger.warn("ネットワークが有効ではないため開けません。")

    const targetUrl = (isLAN && target === "network")
        ? networkUrl
        : `http://localhost:${port}`;

    await open(targetUrl);
}