export function isValidationMeta(
    obj: Record<string, unknown>
): obj is { name: string; version: string } {
    return typeof obj?.name === "string" && typeof obj?.version === "string";
}
