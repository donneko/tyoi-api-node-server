import { tyoi } from "@donneko/tyoi-server";

const app = tyoi({ baseDirname: import.meta.dirname, publicDirname: "./public/main" });
const httpServer = await app.start();
console.log({
    running: app.server.isRunning(),
    port: app.server.getPort(),
    apiPrefix: app.server.getConfig("apiPrefix"),
    sameServer: app.server.getHttpServer() === httpServer,
});
await app.close();
