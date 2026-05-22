import { defineConfig } from "../app/config-server.js";

export default defineConfig({
    port: 3000,
    autoPort:true,

    publicDirname:"../public/main",
    apiPrefix: "/api",

    exposeLan: false,
    showQrCode: false,

    openBrowser: true,
});