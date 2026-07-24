import type { ServerSetupPublicPathDependencies } from "../../../types/server-dependencies.type.js";
import { pathNormalization } from "./path-normalization.js";

export function setupPublicPath(
    baseDirname: string,
    publicDirname: string,
    dependencies: ServerSetupPublicPathDependencies
) {
    const publicDirectoryPath = pathNormalization(baseDirname, publicDirname);
    dependencies.serverRegister.updateConfig({ publicDirectoryPath });
}
