import pc from "picocolors";

export const logger = {
    info(message: string) {
        console.log(
            `${logger._createInfo(message)}`
        );
    },
    _createInfo(message: string):string{
        return `${pc.blueBright("[INFO]")} ${message}`;
    },

    warn(message: string) {
        console.log(
            `${logger._createWarn(message)}`
        );
    },
    _createWarn(message: string):string{
        return `${pc.yellow("[WARN]")} ${message}`;
    },

    error(message: string) {
        console.log(
            `${logger._createError(message)}`
        );
    },
    _createError(message: string):string{
        return `${pc.red("[ERROR]")} ${message}`;
    },

    success(message: string) {
        console.log(
            `${logger._createSuccess(message)}`
        );
    },
    _createSuccess(message: string):string{
        return `${pc.green("[SUCCESS]")} ${message}`;
    },

    process(message: string) {
        console.log(
            `${logger._createProcess(message)}`
        );
    },
    _createProcess(message: string):string{
        return `${pc.magentaBright("[PROCESS]")} ${message}`;
    },

    system(message: string) {
        console.log(
            `${logger._createSystem(message)}`
        );
    },
    _createSystem(message: string):string{
        return `${pc.gray("[SYSTEM]")} ${message}`;
    },

    bar() {
        const width = process.stdout.columns ?? 10;
        console.log("─".repeat(width));
    }
};