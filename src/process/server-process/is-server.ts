import { Server } from "../../server/index.js";

export function isServer(server: unknown): server is Server {
    return server instanceof Server;
}
