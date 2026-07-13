import type { Server } from "../../../server/app/server.js";
import type { ServerMessage } from "../../../types/process.type.js";
import { processSend } from "../../process-send.js";

export default async function serverStart(server: Server) {
    await server.startServer();

    processSend<ServerMessage>(process, {
        type: "ready",
        data: { port: server.getPort() },
    });
}
