import { Logger } from "@donneko/tyoi-logger";

export function showNextSteps(projectName: string): void {
    const logger = new Logger();

    logger.bar();
    logger.success("次のコマンドで起動できます。");
    logger.info(`cd ${projectName}`);
    logger.info("npm install");
    logger.info("npm run dev");
    logger.bar();
}
