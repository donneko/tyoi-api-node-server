import { ConfigController } from "../util/config-controller.js"
import type { ServerDefaultConfig } from "../types/config.type.js"
import TYOI_DEFAULT_CONFIG from "../config/tyoi.default.config.js"

type ConfigControllerType = ConfigController<ServerDefaultConfig>;
export class configManager{
    private configController = new ConfigController<ServerDefaultConfig>(TYOI_DEFAULT_CONFIG);
    updateConfig(
        ...config:Parameters<ConfigControllerType["updateConfig"]>
    ):ReturnType<ConfigControllerType["updateConfig"]>
    {
        return this.configController.updateConfig(...config);
    }
    getConfig(
        ...key:Parameters<ConfigControllerType["getConfig"]>
    ):ReturnType<ConfigControllerType["getConfig"]>
    {
        return this.configController.getConfig(...key);
    }
}