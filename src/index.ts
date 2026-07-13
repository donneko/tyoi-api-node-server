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
export { defineConfig } from "./server/app/config-server.js";
