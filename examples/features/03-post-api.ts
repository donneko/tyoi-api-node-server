import { tyoi } from "@donneko/tyoi-server";

const app = tyoi({ baseDirname: import.meta.dirname, publicDirname: "./public/main" });
app.post("/echo", ({ body }) => ({ received: body }));
await app.start(); // POST JSON to /api/echo
