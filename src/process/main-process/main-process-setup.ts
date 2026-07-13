import type { ChildProcess } from "node:child_process";
import type { MainMessage } from "../../types/process.type.js";
import { processSend } from "../process-send.js";

export function mainProcessSetup(child: ChildProcess) {
    let isShuttingDown = false;

    const shutdown = () => {
        if (isShuttingDown) return;
        isShuttingDown = true;
        try {
            processSend<MainMessage>(child, { type: "shutdown" });
        } catch {
            return;
        }
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
}
