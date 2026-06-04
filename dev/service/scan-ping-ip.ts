import { scanPingIpRange } from "./scan-ping-ip-range.js";

type Option = {
    step?:number;
    end?:number;
}
type Config = {
    step:number;
    end:number;
}
type Output = {
        ip:string;
        ok:boolean;
    }[]

export async function scanPingIp(option?:Option):Promise<Output>{

    const config:Config = {
        ...{
            step:5,
            end:10
        },
        ...option ?? {}
    };

    let data:Output = [];

    for(let i = 0;i < Math.ceil(config.end / config.step);i++ ){

        const start = i * config.step;
        const end   = (i + 1) * config.step;

        data = data.concat(await scanPingIpRange(start,end));
    }

    return data;
}