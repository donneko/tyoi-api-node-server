import { Server } from "../../server/app/server.js";

export function isServer(server: unknown): server is Server {
    return server instanceof Server;
}
