import path from "node:path";
import fs from "node:fs"

export function replacePackageJson(
        projectPath: string,
        projectName: string
    ): void {
    const packageJsonPath = path.join(projectPath, "package.json");

    const text = fs.readFileSync(packageJsonPath, "utf-8");
    const fixText =
        text.replaceAll("__PROJECT_NAME__", projectName)
            .replaceAll("__TYOI_SERVER_VERSION__", "0.0.3");

    fs.writeFileSync(
        packageJsonPath,
        fixText
    );
}