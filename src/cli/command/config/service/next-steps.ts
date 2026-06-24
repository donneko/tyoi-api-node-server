import { Logger } from "@donneko/tyoi-logger";

export function showNextSteps(): void {
    const logger = new Logger();

    logger.bar();
    logger.success("次のコマンドで起動できます。");
    logger.info("npx tyoi run");
    logger.bar();
}
