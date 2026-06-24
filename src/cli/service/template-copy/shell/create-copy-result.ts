import { Logger } from "@donneko/tyoi-logger";

export function createCopyResult({ error, ok }: { error: string[]; ok: string[] }): {
    title: string;
    content: ReturnType<Logger["createError"]>[];
} {
    const logger = new Logger();

    return {
        title: "コピー結果",
        content: [
            ...error.map((m) => logger.createError(m)),
            ...ok.map((m) => logger.createSuccess(m)),
        ],
    };
}
