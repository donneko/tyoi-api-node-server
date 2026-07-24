import http from "node:http";

// httpServer の型やる必要ないなぁ
export function isServerStart(httpServer: unknown, isStarting: boolean): httpServer is http.Server {
    // サーバーが起動していない + サーバーの起動中ではない
    return !(httpServer instanceof http.Server || isStarting);
}
