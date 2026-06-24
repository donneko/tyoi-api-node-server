import { defineConfig } from "@donneko/tyoi-server";
import morgan from "morgan";

export default defineConfig({
    port: 3000,
    autoPort: true,

    publicDirname: "./public/main",
    apiPrefix: "/api",

    exposeLan: false,
    showQrCode: false,

    openBrowser: false,

    middlewares: [morgan("dev")],
});
