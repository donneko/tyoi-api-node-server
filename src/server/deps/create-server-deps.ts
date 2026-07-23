import type { LoggerAllDependencies } from "../types/logger-dependencies.type.js";

export function createLoggerDependencies<T extends LoggerAllDependencies>(
    defaultDependencies: () => T,
    dependencies: Partial<T> = {}
): T {
    return {
        ...defaultDependencies(),
        ...dependencies,
    };
}
