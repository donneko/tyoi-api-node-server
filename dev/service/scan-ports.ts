import { scanPort } from "../util/port-scan.js";

export async function scanPorts(ip:string, ports:number[]):Promise<
    {
        ok: boolean;
        port: number;
        ip: string;
    }[]
>{
    return Promise.all(
        ports.map((port)=>{
            return scanPort(ip,port);
        })
    );
}