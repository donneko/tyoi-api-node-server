import open from "open";
import { getLanIp } from "../util/get-lan-ip.js";
import type { BrowserOpenConfig } from "../types/config.type.js"
import { type ServicesRegister } from "../util/services-register.js";
import { type ServerServicesRegister } from "../app/server.js"

type OpenBrowserData = {
    host:string;
    port:number;
    target:BrowserOpenConfig;
    servicesRegister:ServicesRegister<ServerServicesRegister>;
}

export async function openBrowser(openBrowserData:OpenBrowserData):Promise<void>{
    const {
        host,
        port,
        target,
        servicesRegister
    } = openBrowserData;

    const serverLogger = servicesRegister.get("serverLogger");

    const isLAN = host === "0.0.0.0";
    const ip = getLanIp();
    const networkUrl = `http://${ip}:${port}`;

    if((!isLAN && target === "network")) serverLogger.logger("warn","ネットワークが有効ではないため開けません。");

    const targetUrl = (isLAN && target === "network")
        ? networkUrl
        : `http://localhost:${port}`;

    await open(targetUrl);
}