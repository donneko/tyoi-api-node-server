import dns from "node:dns/promises";

export async function getDns(ip:string):Promise<string>{
    try {
        const result = await dns.reverse(ip);
        return result[0] ?? "unknown";
    } catch (error) {
        return "unknown"
    }
}