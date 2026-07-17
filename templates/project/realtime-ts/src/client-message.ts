export function parseClientMessage(value: string): string | undefined {
    try {
        const data: unknown = JSON.parse(value);
        if (typeof data !== "object" || data === null || !("text" in data)) return undefined;
        if (typeof data.text !== "string") return undefined;
        const text = data.text.trim();
        return text.length > 0 && text.length <= 500 ? text : undefined;
    } catch {
        return undefined;
    }
}
