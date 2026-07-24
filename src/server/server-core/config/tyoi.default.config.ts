import { defineDefaultConfig } from "./define-config.js";

export default defineDefaultConfig({
    port: 3000,
    autoPort: false,

    publicDirname: "../public/main",
    apiPrefix: "/api",

    middlewares: [],

    exposeLan: false,
    showQrCode: false,

    openBrowser: false,

    signalShutdownHandling: true,
});
