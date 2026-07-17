import { describe, expect, it } from "vitest";
import { createTask, listTasks } from "../../../templates/project/api-ts/src/task-store.js";
import { parseCreateTaskInput } from "../../../templates/project/api-ts/src/validation.js";
import { parseClientMessage } from "../../../templates/project/realtime-ts/src/client-message.js";

describe("api-ts behavior", () => {
    it("validates and creates a task", () => {
        const input = parseCreateTaskInput({ title: "  First task  " });
        expect(input).toEqual({ title: "First task" });
        if (!input) throw new Error("Expected valid input");

        const task = createTask(input.title);
        expect(task).toMatchObject({ title: "First task", completed: false });
        expect(listTasks()).toContainEqual(task);
    });

    it.each([undefined, null, {}, { title: "" }, { title: 42 }, { title: "x".repeat(121) }])(
        "rejects invalid task input: %j",
        (input) => {
            expect(parseCreateTaskInput(input)).toBeUndefined();
        }
    );
});

describe("realtime-ts behavior", () => {
    it("accepts a valid JSON message", () => {
        expect(parseClientMessage('{"type":"message","text":"  hello  "}')).toBe("hello");
    });

    it.each(["not-json", "{}", '{"text":""}', '{"text":42}'])(
        "rejects an invalid WebSocket message: %s",
        (message) => {
            expect(parseClientMessage(message)).toBeUndefined();
        }
    );
});
