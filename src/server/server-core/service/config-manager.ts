import { ConfigController } from "../util/config-controller.js";
import {
    type ServerDefaultConfig,
    serverDefaultConfigSchema,
} from "../types/server-config.type.js";
import TYOI_DEFAULT_CONFIG from "../config/tyoi.default.config.js";

type ConfigControllerType = ConfigController<ServerDefaultConfig>;
export class configManager {
    private configController = new ConfigController<ServerDefaultConfig>(
        TYOI_DEFAULT_CONFIG,
        serverDefaultConfigSchema
    );

    updateConfig(
        ...config: Parameters<ConfigControllerType["updateConfig"]>
    ): ReturnType<ConfigControllerType["updateConfig"]> {
        return this.configController.updateConfig(...config);
    }
    getConfig<K extends keyof ServerDefaultConfig>(key: K): ServerDefaultConfig[K] {
        return this.configController.getConfig(key);
    }
}
