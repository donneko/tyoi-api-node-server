import { defineConfig } from "../app/config-server.js";
import type { ServerUserConfig } from "../types/config.type.js";

export default defineConfig<ServerUserConfig>({
    port: 3000,
    autoPort:true,

    publicDirname:"../public/main",
    apiPrefix: "/api",

    exposeLan: false,
    showQrCode: false,

    openBrowser: true,
});