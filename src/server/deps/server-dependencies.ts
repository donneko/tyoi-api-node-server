import type {
    LoggerDependencies,
    LoggerCreateLogDataDependencies,
    LoggerGetWidthDependencies,
    LoggerLogSelectDependencies,
    LoggerWriteDependencies,
} from "../types/logger-dependencies.type.js";
import { getWidth } from "../logic/get-width.js";
import { logSelectProcess } from "../logic/log-select-process.js";
import { writeStderr } from "../logic/write-stderr.js";
import { textNormalizer } from "../logic/text-normalizer.js";
import { writeStdout } from "../logic/write-stdout.js";
import { createLogData } from "../logic/create-log-data.js";

export function defaultLoggerDependencies(): LoggerDependencies {
    return {
        isTTY: Boolean(process.stdout.isTTY),
        width: getWidth(),
        writeStderr: writeStderr,
        logSelectProcess: logSelectProcess,
        textNormalizer: textNormalizer,
        createLogData: createLogData,
    };
}

export function defaultCreateLogDataDependencies(): LoggerCreateLogDataDependencies {
    return {
        date: Date,
    };
}

export function defaultGetWidthDependencies(): LoggerGetWidthDependencies {
    return {
        stdoutColumns: process.stdout.columns,
        envColumns: (() => {
            const columns = Number(process.env.COLUMNS);
            return Number.isFinite(columns) ? columns : undefined;
        })(),
    };
}

export function defaultLogSelectDependencies(): LoggerLogSelectDependencies {
    return {
        isTTY: Boolean(process.stdout.isTTY),
        writeStderr: writeStderr,
        writeStdout: writeStdout,
    };
}

export function defaultWriteDependencies(): LoggerWriteDependencies {
    return {
        processStderrWrite: process.stderr.write,
        processStdoutWrite: process.stdout.write,
    };
}
