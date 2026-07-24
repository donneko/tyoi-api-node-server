import http from "node:http";

export function isServerStop(httpServer: unknown, isStopping: boolean): httpServer is http.Server {
    // サーバーが起動している + サーバーの停止中ではない

    return httpServer instanceof http.Server && !isStopping;
}
