import { defineConfig } from "../server/index.js";

import morgan from "morgan";

export default defineConfig({
    port: 3000,
    autoPort: true,

    publicDirname: "../public/main",
    apiPrefix: "/api",

    middlewares: [morgan("dev")],

    exposeLan: true,
    showQrCode: true,

    openBrowser: false,
});
