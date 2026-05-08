import { defineConfig } from "../app/config-server.js";
import type { ServerUserConfig } from "../types/config.type.js";

export default defineConfig<ServerUserConfig>({
    port: 3000,

    publicDirname: "main",
    apiPrefix: "/api",

    exposeLan: false,
    showQrCode: false,
});