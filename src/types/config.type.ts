import express from "express";

export type BrowserOpenConfig =
    | boolean
    | "local"
    | "network";

export type ServerUserConfig = {
    baseUrl?: string;
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