import { scanPortsRange } from "./scan-ports-range";

type Option = {
    step?:number;
    portEnd?:number;
}
type Config = {
    step:number;
    portEnd:number;
}
type Output = {
        ok: boolean;
        port: number;
        ip: string;
    }[]

export async function scanHost(ip:string,option?:Option):Promise<Output>{

    const config:Config = {
        ...{
            step:10,
            portEnd:100
        },
        ...option ?? {}
    };

    let data:Output = [];

    for(let i = 0;i < Math.ceil(config.portEnd / config.step);i++ ){

        const start = i * config.step;
        const end   = (i + 1) * config.step;

        data = data.concat(await scanPortsRange(ip,start,end));
    }

    return data;
}