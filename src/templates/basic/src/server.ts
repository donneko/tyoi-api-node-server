import { Server } from "../app/server.js";

// サーバー作成
const server = new Server({
    root: import.meta.url,
    publicDirname: "../public/main",
    port: 3000
});

// サーバー起動
await server.startServer();
