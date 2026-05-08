import express from "express";

export type ServerUserConfig = {
    baseUrl?: string;
    publicDirname?: string;
    apiPrefix?: string;
    port?: number;
    middlewares?: express.RequestHandler[];
    exposeLan?: boolean,
    showQrCode?: boolean,
};

export type ServerDefaultConfig = {
    publicDirname: string;
    apiPrefix: string;
    port: number;
    middlewares: express.RequestHandler[];
    exposeLan: boolean,
    showQrCode: boolean,
};