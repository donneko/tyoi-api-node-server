export function parseMacFromArp(ip: string, arpText: string): string | null {
    const lines = arpText.split("\n");

    for (const line of lines) {
        if (!line.includes(`(${ip})`)) continue;

        const match = line.match(/at\s+([0-9a-fA-F:]{17})/);
        return match?.[1] ?? null;
    }

    return null;
}