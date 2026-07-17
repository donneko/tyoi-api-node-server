import { tyoi } from "@donneko/tyoi-server";

const app = tyoi({ baseDirname: import.meta.dirname, publicDirname: "./public/main" });
app.ws("/ws", ({ ws }) => {
    ws.on("message", (message) => ws.send(`echo: ${message.toString()}`));
});
await app.start(); // ws://localhost:3000/ws
