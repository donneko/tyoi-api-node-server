export type CreateTaskInput = { title: string };

export function parseCreateTaskInput(value: unknown): CreateTaskInput | undefined {
    if (typeof value !== "object" || value === null || !("title" in value)) return undefined;
    if (typeof value.title !== "string") return undefined;

    const title = value.title.trim();
    if (title.length === 0 || title.length > 120) return undefined;
    return { title };
}
