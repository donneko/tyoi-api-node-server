import { pingIp } from "../util/ping-ip";

export async function checkInternet(){
    const ip = "8.8.8.8";
    return await pingIp(ip);
}