import { tyoi } from "@donneko/tyoi-server";
import { fail } from "./api-response.js";
import { createTask, listTasks } from "./task-store.js";
import { parseCreateTaskInput } from "./validation.js";

const configuredPort = Number(process.env.PORT ?? 3000);
const port = Number.isInteger(configuredPort) && configuredPort > 0 ? configuredPort : 3000;

const app = tyoi({
    baseDirname: import.meta.dirname,
    publicDirname: "../public/main",
    port,
    autoPort: true,
});

app.get("/health", () => ({
    ok: true,
    service: "tyoi-api",
    timestamp: new Date().toISOString(),
}));

app.get("/tasks", () => ({ ok: true, tasks: listTasks() }));

app.post("/tasks", ({ body }) => {
    const input = parseCreateTaskInput(body);
    if (!input) {
        return fail("INVALID_TASK", "title must be a string between 1 and 120 characters");
    }
    return { ok: true, task: createTask(input.title) };
});

await app.start();
