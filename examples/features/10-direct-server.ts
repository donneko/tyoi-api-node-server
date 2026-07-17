import { Server } from "@donneko/tyoi-server";

type API = "GET:/status" | "POST:/message";
type WS = "/ws";
const server = new Server<API, WS>({
    baseDirname: import.meta.dirname,
    publicDirname: "./public/main",
});

server.onAPI("GET:/status", () => ({ running: true }));
server.onceAPI("POST:/message", ({ body }) => ({ received: body }));
server.onWebSocket("/ws", ({ ws }) => ws.send("connected"));
console.log(server.hasAPI("GET:/status"));
console.log(await server.emitAPI("GET:/status", { query: {}, body: {}, headers: {} }));
server.offAPI("GET:/status");
await server.startServer();
