import { logger } from "../../../../util/logger.js";

export function showNextSteps(projectName: string): void {
    logger.bar();
    logger.success("次のコマンドで起動できます。");
    logger.info(`cd ${projectName}`);
    logger.info("npm install");
    logger.info("npm run dev");
    logger.bar();
}
