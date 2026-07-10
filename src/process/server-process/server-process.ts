import { Server, type ServerOptions } from "../../server/app/server.js";
import type { MainMessage, ServerMessage } from "../../types/process.type.js";
import { processSend } from "../process-send.js";

function isMainMessage(message: unknown): message is MainMessage {
    if (!message || typeof message !== "object" || !("type" in message)) return false;

    return message.type === "boot" || message.type === "shutdown" || message.type === "reload";
}

export function serverBoot() {
    let server: Server | undefined;

    process.on("message", async (message: unknown) => {
        if (!isMainMessage(message)) return;

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
