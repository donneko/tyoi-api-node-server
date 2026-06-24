import path from "node:path";
import fs from "node:fs";

const PACK_REGEX = /^donneko-tyoi-server-[0-9].[0-9].[0-9].tgz$/;
const NOT_REMOVES: string[] = ["node_modules", "package.json", "package-lock.json"];

function isNotRemove(fileName: string): boolean {
    return PACK_REGEX.test(fileName) || NOT_REMOVES.includes(fileName);
}

function clearPlayground(playgroundPath: string) {
    const items = fs.readdirSync(playgroundPath);

    for (const item of items) {
        if (isNotRemove(item)) continue;

        const itemPath = path.join(playgroundPath, item);
        fs.rmSync(itemPath, { recursive: true, force: true });
    }
}

export function undoPlayground(playgroundPath: string) {
    clearPlayground(playgroundPath);
}
