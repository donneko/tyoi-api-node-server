import { afterEach, describe, expect, it } from "vitest";
import { Server } from "../../../src/server/app/server.js";

const runningServers: Server[] = [];

afterEach(async () => {
    await Promise.all(runningServers.splice(0).map((server) => server.stopServer()));
});

describe("server error behavior", () => {
    it("rejects configuration without baseDirname", () => {
        expect(() => new Server()).toThrow("baseDirname is required");
    });

    it("keeps API handler errors out of the public 500 response", async () => {
        const secret = "token=do-not-expose";
        const server = new Server<"GET:/failure">({
            baseDirname: import.meta.dirname,
            port: 0,
            autoPort: false,
            signalShutdownHandling: false,
            showQrCode: false,
            openBrowser: false,
        });
        runningServers.push(server);
        server.onAPI("GET:/failure", () => {
            throw new Error(secret);
        });

        await server.startServer();
        const response = await fetch(`http://127.0.0.1:${server.getPort()}/api/failure`);
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body).toEqual({
            ok: false,
            code: "API_INTERNAL_ERROR",
            message: "Internal server error",
        });
        expect(JSON.stringify(body)).not.toContain(secret);
        expect(JSON.stringify(body)).not.toContain("stack");
    });
});
