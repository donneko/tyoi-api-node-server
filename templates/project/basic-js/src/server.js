import { tyoi } from "@donneko/tyoi-server";
import morgan from "morgan";

const app = tyoi({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main",
    port: 3000,
    autoPort: true,
    middlewares: [morgan("dev")],
});

app.get("/hello", ({ query }) => ({
    message: "Hello from Tyoi!",
    query,
    timestamp: new Date().toISOString(),
}));

app.post("/echo", ({ body }) => ({ received: body }));

app.ws("/ws", ({ ws }) => {
    ws.send("WebSocket connected");
    ws.on("message", (message) => ws.send(`echo: ${message.toString()}`));
});

await app.start({ openBrowser: "local" });
