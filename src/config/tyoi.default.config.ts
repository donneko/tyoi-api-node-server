import { defineConfig } from "../app/config-server.js";
import type { ServerDefaultConfig } from "../types/config.type.js";

export default defineConfig<ServerDefaultConfig>({
    port: 3000,
    autoPort:false,

    publicDirname: "main",
    apiPrefix: "/api",

    middlewares:[],

    exposeLan: false,
    showQrCode: false,

    openBrowser: false,
});