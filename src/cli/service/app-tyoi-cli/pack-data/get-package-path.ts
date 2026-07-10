import path from "path";

export function getPackagePath(): string {
    return path.resolve(import.meta.dirname, "../../../../../package.json");
}
