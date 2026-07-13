/**
 * Tyoi のプログラム API。
 *
 * `Server` は低レベル API、`tyoi()` は API 登録を簡潔に行うための
 * ショートハンド、`defineConfig()` は CLI 用設定を検証するために使います。
 *
 * @packageDocumentation
 */
export { Server } from "./server/app/server.js";
export { tyoi } from "./server/app/short-handler.js";
export { ShortHandler } from "./server/app/short-handler.js";
export { defineConfig } from "./server/app/config-server.js";
export type {
    ServerOptions,
    RequestData,
    RequestEventMap,
    StartServerOptions,
} from "./server/app/server.js";
export type { ApiRegistryHandler } from "./util/api-registry.js";
export type { EventBusHandler } from "./util/event-bus.js";
export type { OutEventBusMap } from "./types/out.event-bus.type.js";
export type { WsHandler } from "./service/web-socket-router.js";
export type { LoggerCreateData } from "./types/out.event-bus.type.js";
export type { BrowserOpenConfig, ServerUserConfig } from "./types/config.type.js";
export { serverUserConfigSchema } from "./types/config.type.js";
