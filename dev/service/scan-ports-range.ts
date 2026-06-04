import { scanPort } from "../util/port-scan.js";

export async function scanPortsRange(ip:string,start:number,end:number):Promise<
    {
        ok: boolean;
        port: number;
        ip: string;
    }[]
>{

    const stack = [];

    for(let port = start;port <= end;port++){
        stack.push(scanPort(ip,port));
    }

    return Promise.all(stack);
}