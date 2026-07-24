import type { OutEventBusMap, InnerEventBusMap } from "./server-event.type.js";
import type { EventBus } from "../util/event-bus.js";
import type { configManager } from "../service/config-manager.js";
import type { ApiRegistry } from "../util/api-registry.js";
import type { ServerLogger } from "../service/server-logger.js";
import type { SystemMetaManager } from "../service/system-meta/system-meta-manager.js";
import type { RegisterManager } from "../service/register-manager.js";
import type { WebSocketRouter } from "../service/web-socket-router.js";
import type { RequestEventMap } from "../types/server.type.js";
import type express from "express";
import type { HttpMetaManager } from "../service/http-meta/http-meta-manager.js";

export type ServerDependencies = {
    innerEventBus: EventBus<InnerEventBusMap>;
    outEventBus: EventBus<OutEventBusMap>;
    serverLogger: ServerLogger;
} & ServerStartDependencies &
    ServerStopDependencies &
    ServerSetupExpressDependencies &
    ServerSetupServerDependencies;

export type ServerStartDependencies = ServerStartServerDependencies;

export type ServerStartServerDependencies = ServerCreateServerConfigDependencies &
    ServerCreateHttpServerDependencies &
    ServerUpdatePortDependencies &
    ServerStartCatchErrorDependencies &
    ServerPostStartupDependencies;

export type ServerCreateServerConfigDependencies = {
    serverConfig: configManager;
    serverRegister: RegisterManager;
} & ServerAvailablePortDependencies;

export type ServerAvailablePortDependencies = {
    serverLogger: ServerLogger;
    systemMetaManager: SystemMetaManager;
};

export type ServerCreateHttpServerDependencies<WebSocketNameList extends string = string> = {
    webSocketRouter: WebSocketRouter<WebSocketNameList>;
    expressServer: express.Express;
};

export type ServerUpdatePortDependencies = {
    serverConfig: configManager;
};

export type ServerPostStartupDependencies = ServerOpenBrowserDependencies &
    ServerStartSummaryDependencies;

export type ServerStartSummaryDependencies = {
    systemMetaManager: SystemMetaManager;
    serverLogger: ServerLogger;
};

export type ServerOpenBrowserDependencies = {
    serverLogger: ServerLogger;
    systemMetaManager: SystemMetaManager;
};

export type ServerStartCatchErrorDependencies = {
    serverLogger: ServerLogger;
    systemMetaManager: SystemMetaManager;
    innerEventBus: EventBus<InnerEventBusMap>;
};
export type ServerStopDependencies = ServerStopServerDependencies;

export type ServerStopServerDependencies = {
    serverLogger: ServerLogger;
    systemMetaManager: SystemMetaManager;
} & ServerCreateFinishDependencies;

export type ServerCreateFinishDependencies = {
    serverLogger: ServerLogger;
    systemMetaManager: SystemMetaManager;
};
export type ServerSetupExpressDependencies = {
    serverConfig: configManager;
    serverLogger: ServerLogger;
    systemMetaManager: SystemMetaManager;
} & ServerCreateExpressConfigDependencies &
    ServerSetupMiddlewareDependencies &
    ServerSetupApiDependencies &
    ServerSetupStaticFileDependencies;

export type ServerCreateExpressConfigDependencies = {
    serverConfig: configManager;
    serverRegister: RegisterManager;
};

export type ServerSetupMiddlewareDependencies = {
    expressServer: express.Express;
};

export type ServerSetupApiDependencies = {
    expressServer: express.Express;
} & ServerApiProcessDependencies;

export type ServerApiProcessDependencies<RequestNameList extends string = string> = {
    serverAPIs: ApiRegistry<RequestEventMap<RequestNameList>>;
};

export type ServerSetupStaticFileDependencies = {
    expressServer: express.Express;
    httpMetaManager: HttpMetaManager;
};

export type ServerSetupServerDependencies = ServerSetupPublicPathDependencies &
    ServerCreateConfigDependencies &
    ServerSetupSignalStopDependencies;

export type ServerSetupPublicPathDependencies = {
    serverRegister: RegisterManager;
};

export type ServerCreateConfigDependencies = {
    serverConfig: configManager;
};

export type ServerSetupSignalStopDependencies = {
    stop: (dependencies: ServerStopServerDependencies) => Promise<void>;
};
