import type { ServerSetupMiddlewareDependencies } from "../../../types/server-dependencies.type.js";
import express from "express";

export function setupDefaultMiddleware(dependencies: ServerSetupMiddlewareDependencies) {
    dependencies.expressServer.use(express.json());
}
