import { pingIp } from "../util/ping-ip.js";

export async function checkInternet(){
    const ip = "8.8.8.8";
    return await pingIp(ip);
}