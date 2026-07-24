import { Server } from "../../../server/index.js";
import type { ServerMessage } from "../../../types/process.type.js";
import { processSend } from "../../process-send.js";

export default async function serverShutdown(server: Server) {
    await server.stop();
    processSend<ServerMessage>(process, { type: "stopped" });
    process.disconnect?.();
    return;
}
