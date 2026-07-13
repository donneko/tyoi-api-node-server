import { Server, type ServerOptions } from "../../server/app/server.js";
import type { MainMessage, ServerMessage } from "../../types/process.type.js";
import { isProcessMessage } from "../is-process-message.js";
import { processSend } from "../process-send.js";

export function serverBoot() {
    let server: Server | undefined;

    const MAIN_MESSAGE_TYPES = ["boot", "shutdown", "reload"];

    process.on("message", async (message: unknown) => {
        if (!isProcessMessage<MainMessage>(message, MAIN_MESSAGE_TYPES)) return;

        if (message.type === "shutdown") {
            await server?.stopServer();
            processSend<ServerMessage>(process, { type: "stopped" });
            process.disconnect?.();
            return;
        }

        if (message.type === "boot") {
            try {
                const { path, option } = message.data;
                const useConfig = path ? await import(path).then((r) => r.default) : {};

                server = new Server({
                    ...useConfig,
                    ...option,
                    signalShutdownHandling: false,
                } as ServerOptions);
                await server.startServer();

                processSend<ServerMessage>(process, {
                    type: "ready",
                    data: { port: server.getPort() },
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                processSend<ServerMessage>(process, { type: "error", message });
                process.disconnect?.();
            }
        }
    });
}

serverBoot();
