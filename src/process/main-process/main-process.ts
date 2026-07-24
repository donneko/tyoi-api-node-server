import { fork } from "node:child_process";
import type { MainMessage } from "../types/process.type.js";
import type { ServerMessage } from "../types/process.type.js";
import { processSend } from "../process-send.js";
import { isProcessMessage } from "../is-process-message.js";
import { mainProcessSetup } from "./main-process-setup.js";

export function serverRuntime(path: string, option: Record<string, unknown>): Promise<void> {
    const SERVER_MESSAGE_TYPES = ["ready", "error", "stopped"];

    const child = fork(new URL("../server-process/server-process.js", import.meta.url));

    mainProcessSetup(child);

    return new Promise<void>((resolve, reject) => {
        let hasStarted = false;

        child.once("error", reject);
        child.once("exit", (code, signal) => {
            if (!hasStarted) {
                reject(
                    new Error(
                        `Server process exited before startup (code=${code}, signal=${signal})`
                    )
                );
            }
        });
        child.on("message", (message: unknown) => {
            if (!isProcessMessage<ServerMessage>(message, SERVER_MESSAGE_TYPES)) return;

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
        processSend<MainMessage>(child, {
            type: "start",
        });
    });
}
