import { logger } from "../../../../util/logger.js";

export function showNextSteps(): void {
    logger.bar();
    logger.success("次のコマンドで起動できます。");
    logger.info("npx tyoi run");
    logger.bar();
}
