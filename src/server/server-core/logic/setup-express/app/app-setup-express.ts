import { createExpressConfig } from "../service/create-express-config.js";
import type { ServerSetupExpressDependencies } from "../../../types/server-dependencies.type.js";
import { setupMiddleware } from "../service/setup-middleware.js";
import { setupDefaultMiddleware } from "../service/setup-default-middleware.js";
import { setupApiProcess } from "./app-setup-api-process.js";
import { setupStaticFile } from "./app-setup-static.js";

export function setupExpress(dependencies: ServerSetupExpressDependencies) {
    const expressConfig = createExpressConfig(dependencies);

    // ミドルウェア
    setupMiddleware(expressConfig.middlewares, dependencies);

    // JSONを受け取れるようにする
    setupDefaultMiddleware(dependencies);

    // API
    setupApiProcess(expressConfig.apiPrefix, dependencies);

    // 静的ファイル配信
    setupStaticFile(expressConfig.publicDirectoryPath, dependencies);
}
