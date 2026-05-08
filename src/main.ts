import { Server } from "./app/server.js";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import slowDown from "express-slow-down";

type RequestNameList = "GET:/test" | "GET:/test/a" | "GET:/a";

// const config = await import("./config/tyoi.config.js");
// config.default;
const server = new Server<RequestNameList>({
    baseUrl:import.meta.url,
    publicDirname:"main",
    apiPrefix:"/api",
    port:3000,
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
    ]
});

await server.startServer({
    exposeLan:true,
    showQrCode: true,
    port:3000
});

server.onAPI("GET:/a",(data)=>{
    return data;
})