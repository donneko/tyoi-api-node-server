export function removeUndefined<T extends object>(value: T) {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined));
}
