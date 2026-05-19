import os from "node:os";

export function getIp(): Array<{address: string; netmask: string}> {
    const work = os.networkInterfaces();
    const list: Array<{address: string; netmask: string}> = [];

    for (const name in work) {
        const level = work[name];
        if (!level) continue;

        for (const data of level) {
            if (data.internal) continue;
            if (data.family !== "IPv4") continue;

            list.push({
                address: data.address,
                netmask: data.netmask
            });
        }
    }
    return list;
}