export function jsonToMeta(obj: Record<string, unknown>) {
    const meta = {
        name: obj?.name,
        version: obj?.version,
    };

    return meta;
}
