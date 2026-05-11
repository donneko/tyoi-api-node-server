import { Server } from "@donneko/tyoi-server";

// サーバー作成
const server = new Server({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main",
    port: 3000
});

// サーバー起動
await server.startServer();
