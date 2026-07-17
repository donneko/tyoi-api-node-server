import { describe, expect, it } from "vitest";
import { isProcessMessage } from "../../../src/process/is-process-message.js";
import type { ServerMessage } from "../../../src/types/process.type.js";

describe("isProcessMessage", () => {
    const messageTypes = ["ready", "error", "stopped"];

    it.each([
        { type: "ready", data: { port: 3000 } },
        { type: "error", message: "startup failed" },
        { type: "stopped" },
    ] satisfies ServerMessage[])("accepts a known message type: $type", (message) => {
        expect(isProcessMessage<ServerMessage>(message, messageTypes)).toBe(true);
    });

    it.each([null, undefined, "ready", {}, { type: 1 }, { type: "unknown" }])(
        "rejects an invalid process message: %j",
        (message) => {
            expect(isProcessMessage<ServerMessage>(message, messageTypes)).toBe(false);
        }
    );
});
