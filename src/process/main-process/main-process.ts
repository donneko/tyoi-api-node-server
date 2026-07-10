import { fork } from "node:child_process";
import type { MainMessage } from "../../types/process.type.js";
import type { ServerMessage } from "../../types/process.type.js";
import { processSend } from "../process-send.js";

function isServerMessage(message: unknown): message is ServerMessage {
    if (!message || typeof message !== "object" || !("type" in message)) return false;

    return message.type === "ready" || message.type === "error" || message.type === "stopped";
}

export function serverRuntime(path: string, option: Record<string, unknown>): Promise<void> {
    const child = fork(new URL("../server-process/server-process.js", import.meta.url));
    let isShuttingDown = false;

    const shutdown = () => {
        if (isShuttingDown || !child.connected) return;
        isShuttingDown = true;
        processSend<MainMessage>(child, { type: "shutdown" });
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);

    return new Promise<void>((resolve, reject) => {
        let hasStarted = false;

        child.once("error", reject);
        child.once("exit", (code, signal) => {
            if (!hasStarted) {
                reject(new Error(`Server process exited before startup (code=${code}, signal=${signal})`));
            }
        });
        child.on("message", (message: unknown) => {
            if (!isServerMessage(message)) return;

            if (message.type === "ready") {
                hasStarted = true;
                resolve();
                return;
            }
            if (message.type === "error") {
                reject(new Error(message.message));
                child.disconnect();
            }
        });

        processSend<MainMessage>(child, {
            type: "boot",
            data: { path, option },
        });
    });
}
