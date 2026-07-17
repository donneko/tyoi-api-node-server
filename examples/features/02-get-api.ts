import { tyoi } from "@donneko/tyoi-server";

const app = tyoi({ baseDirname: import.meta.dirname, publicDirname: "./public/main" });
app.get("/hello", ({ query }) => ({ message: "Hello!", query }));
await app.start(); // GET /api/hello?name=Tyoi
