import pc from "picocolors";

export const logger = {
    info(message: string) {
        console.log(
            `${pc.blueBright("[INFO]")} ${message}`
        );
    },

    warn(message: string) {
        console.log(
            `${pc.yellow("[WARN]")} ${message}`
        );
    },

    error(message: string) {
        console.log(
            `${pc.red("[ERROR]")} ${message}`
        );
    },

    success(message: string) {
        console.log(
            `${pc.green("[SUCCESS]")} ${message}`
        );
    },

    system(message: string) {
        console.log(
            `${pc.gray("[SYSTEM]")} ${message}`
        );
    },
};