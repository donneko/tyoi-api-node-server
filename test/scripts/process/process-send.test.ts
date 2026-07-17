import type { ChildProcess } from "node:child_process";
import { describe, expect, it, vi } from "vitest";
import { processSend } from "../../../src/process/process-send.js";

type ProcessSender = Pick<ChildProcess, "connected" | "send">;

describe("processSend", () => {
    it("sends data through a connected IPC channel", () => {
        const send = vi.fn();
        const proc = { connected: true, send } as unknown as ProcessSender;
        const message = { type: "ready", data: { port: 3000 } };

        processSend(proc, message);

        expect(send).toHaveBeenCalledOnce();
        expect(send).toHaveBeenCalledWith(message);
    });

    it("throws without calling send when the IPC channel is disconnected", () => {
        const send = vi.fn();
        const proc = { connected: false, send } as unknown as ProcessSender;

        expect(() => processSend(proc, { type: "ready" })).toThrow("IPC channel is not connected");
        expect(send).not.toHaveBeenCalled();
    });
});
