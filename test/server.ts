import { Server } from "../src/index.js";
import { getSerial } from "./serial.js";

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


// サーバーのAPI
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



// アルディーノ通信用
// const {
//     parser,
//     port
// } = getSerial();
// port.on("open", () => {
//     console.log("Arduino connected");
//     console.log("送信したい文字を入力してください");
//     setTimeout(() => {
//         port.write("hello\n");
//     }, 2000);
// });

// parser.on("data",(line)=>{
// })

// port.write("aaa" + "\n");