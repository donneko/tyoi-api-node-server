import type { ChildProcess } from "node:child_process";
import type { MainMessage } from "../../types/process.type.js";
import { processSend } from "../process-send.js";

export function mainProcessSetup(child: ChildProcess) {
    let isShuttingDown = false;

    const shutdown = () => {
        if (isShuttingDown || !child.connected) return;
        isShuttingDown = true;
        processSend<MainMessage>(child, { type: "shutdown" });
    };

    process.once("SIGINT", shutdown);
    process.once("SIGTERM", shutdown);
}
