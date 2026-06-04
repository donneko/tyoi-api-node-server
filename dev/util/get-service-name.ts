const SERVICE_NAMES: Record<number, string> = {
    20: "FTP Data",
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    123: "NTP",
    143: "IMAP",
    443: "HTTPS",
    445: "SMB",
    3306: "MySQL",
    5432: "PostgreSQL",
    6379: "Redis",
    8080: "HTTP Alt",
    3000: "Dev",
    5173: "Vite",
    5500: "Live Server",
    8000: "Dev",
    27017: "MongoDB",
};

export function getServiceName(port: number): string {
    return SERVICE_NAMES[port] ?? "Unknown";
}