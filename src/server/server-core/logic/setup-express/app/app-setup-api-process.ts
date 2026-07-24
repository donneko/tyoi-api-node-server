import type { ServerSetupApiDependencies } from "../../../types/server-dependencies.type.js";
import { apiProcess } from "../service/api-process.js";

export async function setupApiProcess(apiPrefix: string, dependencies: ServerSetupApiDependencies) {
    dependencies.expressServer.use(apiPrefix, (rep, res) => apiProcess(rep, res, dependencies));
}
