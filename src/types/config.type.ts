import express from "express";
import z from "zod";

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

export const serverDefaultConfigSchema = z.object({
    baseDirname: z.string().optional(),
    publicDirname: z.string(),
    apiPrefix: z.string(),
    port: z.number(),
    middlewares: z.array(z.function()),
    exposeLan: z.boolean(),
    showQrCode: z.boolean(),
    openBrowser: z.union([z.boolean(), z.enum(["local", "network"])]),
    autoPort: z.boolean(),
    signalShutdownHandling: z.boolean()
});

export type ServerDefaultConfig = z.infer<typeof serverDefaultConfigSchema>;
