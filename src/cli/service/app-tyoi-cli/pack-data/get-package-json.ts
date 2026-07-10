import fs from "fs/promises";

export async function getPackageJson(path: string): Promise<Record<string, unknown>> {
    const file = await fs.readFile(path, { encoding: "utf-8" });
    const json = JSON.parse(file);
    return json;
}
