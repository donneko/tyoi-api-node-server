import path from "node:path";
import fs from "node:fs"


export function replacePackageJson(
        projectPath: string,
        projectName: string
    ): void {
    const packageJsonPath = path.join(projectPath, "package.json");

    const text = fs.readFileSync(packageJsonPath, "utf-8");
    text.replaceAll("__PROJECT_NAME__", projectName);

    fs.writeFileSync(
        packageJsonPath,
        text
    );
}