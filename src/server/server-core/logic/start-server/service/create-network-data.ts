import { getLanIp } from "../util/get-lan-ip.js";
import { ServerCreateNetworkReturn } from "../../../types/server.type.js";
export function createNetworkData(port: number, host: string): ServerCreateNetworkReturn {
    // LAN設定
    const isLAN = host === "0.0.0.0";
    const ip = getLanIp();
    const networkUrl = `http://${ip}:${port}`;

    return { networkUrl, isLAN };
}
