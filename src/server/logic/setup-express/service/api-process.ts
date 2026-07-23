import type { ServerApiProcessDependencies } from "../../../types/server-dependencies.type.js";
import type express from "express";

export async function apiProcess(
    req: express.Request,
    res: express.Response,
    dependencies: ServerApiProcessDependencies
) {
    try {
        const key = `${req.method}:${req.path}`;

        if (!dependencies.serverAPIs.has(key)) {
            res.status(404).json({
                ok: false,
                code: "API_NOT_FOUND",
                message: "API not found",
            });
            return;
        }

        const result = await dependencies.serverAPIs.emit(key, {
            query: req.query,
            body: req.body,
            headers: req.headers,
        });

        res.json({
            ok: true,
            data: result,
        });
    } catch {
        res.status(500).json({
            ok: false,
            code: "API_INTERNAL_ERROR",
            message: "Internal server error",
        });
    }
}
