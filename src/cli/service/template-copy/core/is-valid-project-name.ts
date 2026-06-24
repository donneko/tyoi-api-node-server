export function isValidProjectName(projectName: string): boolean {
    return /^[a-zA-Z0-9-]+$/.test(projectName);
}
