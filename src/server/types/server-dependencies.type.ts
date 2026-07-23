import type { OutEventBusMap, InnerEventBusMap } from "./server-event-bus.type.js";
import type { EventBus } from "../../util/event-bus.js";
import type { configManager } from "../../service/config-manager.js";
import type express from "express";

export type ServerServicesRegister = {
    innerEventBus: EventBus<InnerEventBusMap>;
    outEventBus: EventBus<OutEventBusMap>;
    serverLogger: ServerLogger;
    httpMetaManager: HttpMetaManager;
    systemMetaManager: SystemMetaManager;
    serverConfig: configManager;
    serverRegister: RegisterManager;
};

export type ServerStartDependencies = ServerStartServerDependencies;

export type ServerStartServerDependencies = ServerCreateServerConfigDependencies &
    ServerCreateHttpServerDependencies &
    ServerUpdatePortDependencies &
    ServerStartCatchErrorDependencies;

export type ServerCreateServerConfigDependencies = {
    serverConfig: configManager;
    serverRegister;
} & ServerAvailablePortDependencies;

export type ServerAvailablePortDependencies = {
    serverLogger;
    systemMetaManager;
};

export type ServerCreateHttpServerDependencies = {
    webSocketRouter;
    appServer;
};

export type ServerUpdatePortDependencies = {
    serverConfig: configManager;
};

export type ServerPostStartupDependencies = ServerOpenBrowserDependencies &
    ServerStartSummaryDependencies;

export type ServerStartSummaryDependencies = {
    systemMetaManager;
    serverLogger;
};

export type ServerOpenBrowserDependencies = {
    serverLogger;
    systemMetaManager;
};

export type ServerStartCatchErrorDependencies = {
    serverLogger;
    systemMetaManager;
    innerEventBus;
};
export type ServerStopDependencies = ServerStopServerDependencies;

export type ServerStopServerDependencies = {
    serverLogger;
    systemMetaManager;
} & ServerCreateFinishDependencies;

export type ServerCreateFinishDependencies = {
    serverLogger;
    systemMetaManager;
};
export type ServerSetupExpressDependencies = {
    serverConfig: configManager;
    serverLogger;
    systemMetaManager;
} & ServerCreateExpressConfigDependencies &
    ServerSetupMiddlewareDependencies &
    ServerSetupApiDependencies;

export type ServerCreateExpressConfigDependencies = {
    serverConfig: configManager;
    serverRegister;
};

export type ServerSetupMiddlewareDependencies = {
    expressServer: express.Express;
};

export type ServerSetupApiDependencies = {
    expressServer: express.Express;
} & ServerApiProcessDependencies;

export type ServerApiProcessDependencies = {
    serverAPIs;
};

export type ServerSetupStaticFileDependencies = {
    expressServer: express.Express;
    systemMetaManager;
};

export type ServerSetupServerDependencies = ServerCreatePublicPathDependencies &
    ServerCreateConfigDependencies &
    ServerSetupSignalStopDependencies;

export type ServerSetupPublicPathDependencies = {
    serverRegister;
};

export type ServerCreateConfigDependencies = {
    serverConfig;
};

export type ServerSetupSignalStopDependencies = {
    stop: () => Promise<void>;
};
