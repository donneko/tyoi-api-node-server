import { ConfigController } from "../util/config-controller.js"
import type { ServerRegister } from "../types/register.type.js"
type RegisterControllerType = ConfigController<ServerRegister>;
export class RegisterManager{
    private configController = new ConfigController<ServerRegister>({});
    updateConfig(
        ...config:Parameters<RegisterControllerType["updateConfig"]>
    ):ReturnType<RegisterControllerType["updateConfig"]>
    {
        return this.configController.updateConfig(...config);
    }
    getConfig<K extends keyof ServerRegister>(
        key: K
    ): ServerRegister[K] {
        return this.configController.getConfig(key);
    }
}