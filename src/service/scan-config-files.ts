import path from "path";
import { readDirectory } from "../util/read-directory.js";

export async function scanConfigFiles(passedPath: string): Promise<string[]> {
    const regex = /^(tyoi)\.([A-Za-z0-9.]+(\.config)|config)\.(ts|js)$/;

    const current = await readDirectory(passedPath);
    const filteredCurrent = current.filter((file) => regex.test(file));

    if (!current.includes("config")) return filteredCurrent.toSorted();

    const configPath = path.join(passedPath, "config");
    const configFiles = await readDirectory(configPath, true);
    const filteredConfigFiles = configFiles
        .filter((file) => {
            const fileName = path.basename(file);
            return regex.test(fileName);
        })
        .map((value) => {
            return `config${path.sep}${value}`;
        });

    return filteredCurrent.concat(filteredConfigFiles).toSorted();
}
