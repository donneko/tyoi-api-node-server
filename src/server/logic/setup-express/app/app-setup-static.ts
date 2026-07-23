import type { ServerSetupStaticFileDependencies } from "../../../types/server-dependencies.type.js";
import express from "express";

export function setupStaticFile(
    publicDirectoryPath: string,
    dependencies: ServerSetupStaticFileDependencies
) {
    dependencies.expressServer.use(express.static(publicDirectoryPath));

    dependencies.expressServer.use((req, res) => {
        const sendData = dependencies.systemMetaManager.getMeta(404);
        res.status(sendData.code).send(
            `<h1>${sendData.message}</h1><br><p>${sendData.description}</p>`
        );
    });
}
