import type { Server } from "../../../server/index.js";
import type { ServerMessage } from "../../types/process.type.js";
import { processSend } from "../../process-send.js";

export default async function serverStart(server: Server) {
    await server.start();

    processSend<ServerMessage>(process, {
        type: "ready",
        data: { port: server.getPort() },
    });
}
