import express from "express";

export type BrowserOpenConfig =
    | boolean
    | "local"
    | "network";

export type ServerUserConfig = {
    baseDirname?: string;
    publicDirname?: string;
    apiPrefix?: string;
    port?: number;
    middlewares?: express.RequestHandler[];
    exposeLan?: boolean;
    showQrCode?: boolean;
    openBrowser?:BrowserOpenConfig;
    autoPort?:boolean;
    signalShutdownHandling?:boolean
};

export type ServerDefaultConfig = {
    baseDirname?: string;
    publicDirname: string;
    apiPrefix: string;
    port: number;
    middlewares: express.RequestHandler[];
    exposeLan: boolean;
    showQrCode: boolean;
    openBrowser:BrowserOpenConfig;
    autoPort:boolean;
    signalShutdownHandling:boolean;
};