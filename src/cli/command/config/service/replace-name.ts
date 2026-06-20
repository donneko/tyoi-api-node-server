import path from "node:path";
import fs from "node:fs"
import type { CmdMetaData } from "../../../types/tyoi-cli.js";

export function replacePackageJson(
        projectPath: string,
        projectName: string,
        pack:CmdMetaData["meta"]["pack"]
    ): void {
    const packageJsonPath = path.join(projectPath, "package.json");

    const text = fs.readFileSync(packageJsonPath, "utf-8");
    const fixText =
        text.replaceAll("__PROJECT_NAME__", projectName)
            .replaceAll("__TYOI_SERVER_VERSION__", pack.version);

    fs.writeFileSync(
        packageJsonPath,
        fixText
    );
}