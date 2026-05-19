import net from "node:net";

type ScanPortOption = {
    timeout?:number;
}
type ScanPortConfig = {
    timeout:number;
}


export async function scanPort(ip:string, port:number,option?:ScanPortOption):Promise<{
        ok:boolean;
        port:number;
        ip:string;
    }>{
    return new Promise((resolve) => {

        let done = false;
        const socket = new net.Socket();

        const finish = (ok:boolean) => {
            if(done) return;
            done = true;

            socket.destroy();

            resolve({
                ok,
                port,
                ip
            });
        };

        const config: ScanPortConfig = {
            timeout: option?.timeout ?? 1000,
        };

        socket.connect(port, ip);
        socket.setTimeout(config.timeout,()=>{
            finish(false);
        });
        socket.on("connect",()=>{
            finish(true);
        });
        socket.on("error",()=>{
            finish(false);
        });
    });
}