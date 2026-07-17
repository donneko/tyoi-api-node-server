import { tyoi } from "@donneko/tyoi-server";
import morgan from "morgan";

const app = tyoi({
    baseDirname: import.meta.dirname,
    publicDirname: "./public/main",
    middlewares: [morgan("dev")],
});
await app.start();
