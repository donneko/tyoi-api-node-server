import fs from 'fs/promises';

export async function readDirectory(filePath: string, recursive: boolean = false): Promise<string[]> {
    const data = await fs.readdir(filePath, { recursive });
    return data;
}
