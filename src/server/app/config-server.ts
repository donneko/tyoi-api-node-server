import { serverDefaultConfigSchema, serverUserConfigSchema } from "../../types/config.type.js";
import type { ServerUserConfig, ServerDefaultConfig } from "../../types/config.type.js";

export function defineConfig(config: ServerUserConfig) {
    return serverUserConfigSchema.parse(config);
}
export function defineDefaultConfig(config: ServerDefaultConfig) {
    return serverDefaultConfigSchema.parse(config);
}
