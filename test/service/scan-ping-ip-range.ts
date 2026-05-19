import { getIp } from "../util/get-ip";
import { pingIp } from "../util/ping-ip";

type Output = {
        ip:string;
        ok:boolean;
    }[]

export async function scanPingIpRange(start:number,end:number):Promise<Output>{
    const ip = getIp()[0] || null;
    if(!ip.address)return [];

    const ipSplit = ip.address.split(".")
    const stack = [];

    for(let i = start;i < end;i++){
        const ip = `${ipSplit[0]}.${ipSplit[1]}.${ipSplit[2]}.${i}`;
        stack.push(pingIp(ip));
    }

    return Promise.all(stack);

}