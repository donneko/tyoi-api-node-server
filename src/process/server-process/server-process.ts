import type { Server } from "../../server/app/server.js";
import type { MainMessage, ServerMessage } from "../../types/process.type.js";
import { isProcessMessage } from "../is-process-message.js";
import { processSend } from "../process-send.js";
import serverBootLogic from "./logic/boot.js";
import serverStartLogic from "./logic/start.js";
import serverShutdownLogic from "./logic/shutdown.js";
import { isServer } from "./is-server.js";

export function serverBoot() {
    let server: Server | undefined;

    const MAIN_MESSAGE_TYPES = ["boot", "shutdown", "reload"];

    process.on("message", async (message: unknown) => {
        if (!isProcessMessage<MainMessage>(message, MAIN_MESSAGE_TYPES)) return;
        try {
            switch (message.type) {
                case "boot":
                    server = await serverBootLogic(message);
                    break;
                case "start":
                    if (!isServer(server)) return;
                    serverStartLogic(server);
                    break;
                case "shutdown":
                    if (!isServer(server)) return;
                    serverShutdownLogic(server);
                    break;
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            processSend<ServerMessage>(process, { type: "error", message });
            process.disconnect?.();
        }
    });
}

serverBoot();
