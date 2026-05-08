import { defineConfig } from "../app/config-server.js";
import type { ServerUserConfig } from "../types/config.type.js";

import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import slowDown from "express-slow-down";

export default defineConfig<ServerUserConfig>({
    port: 3000,

    publicDirname:"main",
    apiPrefix:"/api",

    middlewares:[
        helmet(),
        cors(),
        morgan("dev"),

        rateLimit({
            windowMs: 60 * 1000,
            max: 100
        }),

        slowDown({
            windowMs: 60 * 1000,
            delayAfter: 5,
            delayMs: () => 500
        }),

        hpp()
    ],

    exposeLan: false,
    showQrCode: false,

    openBrowser: true,
});