import { tyoi } from "@donneko/tyoi-server";

const app = tyoi({ baseDirname: import.meta.dirname, publicDirname: "./public/main" });
await app.start();
