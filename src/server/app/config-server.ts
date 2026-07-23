import { serverDefaultConfigSchema, serverUserConfigSchema } from "../types/server-config.type.js";
import type { ServerUserConfig, ServerDefaultConfig } from "../types/server-config.type.js";

/**
 * CLI で読み込むサーバー設定を検証して返します。
 *
 * `tyoi.config.js` の default export に指定します。
 * `baseDirname` は CLI 起動時に自動設定されるため、通常は指定不要です。
 *
 * @param config サーバー設定。未指定の項目には既定値が使われます。
 * @returns 検証済みのユーザー設定。
 * @throws {ZodError} 設定値が不正な場合。
 *
 * @example
 * ```ts
 * import { defineConfig } from "@donneko/tyoi-server";
 *
 * export default defineConfig({
 *   port: 3000,
 *   publicDirname: "../public/main",
 * });
 * ```
 */
export function defineConfig(config: ServerUserConfig): ServerUserConfig {
    return serverUserConfigSchema.parse(config);
}
export function defineDefaultConfig(config: ServerDefaultConfig) {
    return serverDefaultConfigSchema.parse(config);
}
