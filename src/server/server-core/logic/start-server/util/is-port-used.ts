import net from "node:net";

export async function isPortUsed(port: number, host: string): Promise<boolean> {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.once("error", (err: NodeJS.ErrnoException) => {
            if (err.code === "EADDRINUSE") {
                resolve(true);
            } else {
                resolve(false);
            }
        });

        server.once("listening", () => {
            server.close();
            resolve(false);
        });

        server.listen(port, host);
    });
}
