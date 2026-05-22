import { defineConfig } from "./dist/index.js";

export default defineConfig({
    port: 3000,
    autoPort:true,

    publicDirname:"./public/main",
    apiPrefix: "/api",

    exposeLan: false,
    showQrCode: false,

    openBrowser: true,
});
