import { exec } from "node:child_process";

type PingIpOption = {
    timeout?:number;
}
type PingIpConfig = {
    timeout:number;
}

export async function pingIp(ip:string,option?:PingIpOption):Promise<{
        ip:string;
        ok:boolean;
    }>{

    const config:PingIpConfig = {
        ...{
            timeout:1000
        },
        ...option ?? {}
    };

    if(!ip)throw new Error("ipが指定されていません");

    return new Promise((resolve) => {

        const child = exec(`ping -c 1 ${ip}`, (error) => {
            clearTimeout(timer);
            resolve({ ip, ok: !error });
        });

        const timer = setTimeout(() => {
            child.kill();
            resolve({ ip, ok: false });
        }, config.timeout);
    });
}
