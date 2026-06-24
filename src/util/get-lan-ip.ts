import os from "node:os";

export function getLanIp() {
    const nets = os.networkInterfaces();

    for (const name in nets) {
        const netList = nets[name];

        if (!netList) continue;

        for (const net of netList) {
            if (net.family === "IPv4" && !net.internal) {
                return net.address;
            }
        }
    }

    return "localhost";
}
