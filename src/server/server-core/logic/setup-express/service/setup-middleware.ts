import type { ServerSetupMiddlewareDependencies } from "../../../types/server-dependencies.type.js";
import type express from "express";

export function setupMiddleware(
    middlewares: express.RequestHandler[],
    dependencies: ServerSetupMiddlewareDependencies
) {
    for (const ware of middlewares) {
        dependencies.expressServer.use(ware);
    }
}
