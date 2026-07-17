import { tyoi } from "@donneko/tyoi-server";

const app = tyoi({
    baseDirname: import.meta.dirname,
    publicDirname: "./public/main",
    port: 3000,
    autoPort: true,
});
await app.start({ openBrowser: "local" });
