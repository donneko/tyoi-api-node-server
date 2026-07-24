import type { ServerUserConfig } from "./server-config.type.js";
import type express from "express";
import type { IncomingMessage } from "node:http";
import type { WebSocket } from "ws";

/** HTTP API ハンドラに渡されるリクエスト情報です。 */
export type RequestData = {
    query: unknown;
    body: unknown;
    headers: unknown;
};

export type WsHandler = {
    ws: WebSocket;
    req: IncomingMessage;
};
export type ServerRegister = {
    publicDirectoryPath?: string;
};

export type RequestEventMap<L extends string> = {
    [N in L]: RequestData;
};
/** `start()` 呼び出し時に上書きできる起動設定です。 */
export type ServerStartOptions = {
    port?: number;
    exposeLan?: boolean;
    showQrCode?: boolean;
    autoPort?: boolean;
    openBrowser?: ServerOpenBrowserTarget;
};
/** `Server` をコードから作成するための設定です。 */
export type ServerOptions = ServerUserConfig & {
    baseDirname: string;
};

export type ServerStartUseConfig = {
    port: number;
    exposeLan: boolean;
    showQrCode: boolean;
    publicPath: string;
    publicFullPath: string;
    openBrowser: ServerOpenBrowserTarget;
    apiPrefix: string;
    host: "0.0.0.0" | "127.0.0.1";
};

export type ServerStartFindPortArgs = {
    startPort: number;
    host: string;
    isAutoPort: boolean;
};

export type ServerStartSummaryArgs = {
    host: string;
    port: number;
    publicPath: string;
    publicFullPath: string;
    apiPrefix: string;
    showQrCode: boolean;
};

export type ServerCreateNetworkReturn = { networkUrl: string; isLAN: boolean };

export type ServerOpenBrowserTarget = boolean | "local" | "network";

export type ServerOpenBrowserArgs = {
    host: string;
    port: number;
    target: ServerOpenBrowserTarget;
};

export type ServerCreateExpressConfigReturn = {
    middlewares: express.RequestHandler[];
    apiPrefix: string;
    publicDirectoryPath: string;
};

export type ServerCreateServerConfigReturn = {
    baseDirname: string;
    publicDirname: string;
    signalShutdownHandling: boolean;
};
