import pc from "picocolors";

export const logger = {
    info(message: string) {
        console.log(
            `${this._createInfo(message)}`
        );
    },
    _createInfo(message: string):string{
        return `${pc.blueBright("[INFO]")} ${message}`;
    },

    warn(message: string) {
        console.log(
            `${this._createWarn(message)}`
        );
    },
    _createWarn(message: string):string{
        return `${pc.yellow("[WARN]")} ${message}`;
    },

    error(message: string) {
        console.log(
            `${this._createError(message)}`
        );
    },
    _createError(message: string):string{
        return `${pc.red("[ERROR]")} ${message}`;
    },

    success(message: string) {
        console.log(
            `${this._createSuccess(message)}`
        );
    },
    _createSuccess(message: string):string{
        return `${pc.green("[SUCCESS]")} ${message}`;
    },

    system(message: string) {
        console.log(
            `${this._createSystem(message)}`
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