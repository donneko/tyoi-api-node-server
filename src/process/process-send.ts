import type { ChildProcess } from "node:child_process";

type ProcessSender = Pick<ChildProcess, "connected" | "send"> | NodeJS.Process;

export function processSend<DATA extends object>(proc: ProcessSender, data: DATA): void {
    if (!proc.connected || !proc.send) {
        throw new Error("IPC channel is not connected");
    }

    proc.send(data);
}
