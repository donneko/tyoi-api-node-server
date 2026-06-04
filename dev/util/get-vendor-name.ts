const OUI_VENDOR: Record<string, string> = {
    "00-1A-11": "Google",
    "3C-22-FB": "Apple",
    "F4-F5-D8": "Google",
};

function getOui(mac: string): string {
    return mac
        .slice(0, 8)
        .toUpperCase()
        .replaceAll(":", "-");
}

export function getVendorName(mac: string): string {
    const oui = getOui(mac);
    return OUI_VENDOR[oui] ?? "Unknown";
}