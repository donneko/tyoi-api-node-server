import { Server } from "../src/index.js";

type ApiName = "GET:/a" | "POST:/a" | "GET:/b"

const config = await import("../src/config/tyoi.dev.config.js")

// サーバー作成
const server = new Server<ApiName>({
    ...config.default,
    ...{
        baseDirname: import.meta.dirname,
        publicDirname: "./public",
        port: 3000,
        exposeLan: false,
        showQrCode: true,
    }
});

const messageData:string[] = [];
server.onAPI("POST:/a",(data)=>{
    const message = (data.body as { message?: string } | undefined)?.message;
    messageData.push(message || "");
});
server.onAPI("GET:/a",(data)=>{
    return {
        message:messageData
    }
});

// サーバー起動
await server.startServer();