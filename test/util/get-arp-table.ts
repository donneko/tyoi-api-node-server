import { exec } from "node:child_process";

export function getArpTable(): Promise<string> {
    return new Promise((resolve, reject) => {
        exec("arp -a", (error, stdout) => {
            if(error){
                reject(error);
            }else{
                resolve(stdout);
            }
        });
    });
}