import { defineConfig } from "../app/config-server.js";
import type { ServerConfig } from "../app/server.js";

export default defineConfig<ServerConfig>({
    port: 3000,

    publicDirname: "main",
    apiPrefix: "/api",

    exposeLan: false,
    showQrCode: false,
});