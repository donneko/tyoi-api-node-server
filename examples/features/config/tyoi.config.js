import { defineConfig } from "@donneko/tyoi-server";

export default defineConfig({
    port: 3000,
    autoPort: true,
    publicDirname: "../public/main",
    apiPrefix: "/api",
    openBrowser: "local",
    exposeLan: false,
    showQrCode: false,
});
