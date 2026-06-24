import express from "express";
import z from "zod";

export type BrowserOpenConfig = boolean | "local" | "network";

export const serverUserConfigSchema = z.object({
    baseDirname: z.string().optional(),
    publicDirname: z.string().optional(),
    apiPrefix: z.string().optional(),
    port: z.number().optional(),
    middlewares: z.array(z.custom<express.RequestHandler>()).optional(),
    exposeLan: z.boolean().optional(),
    showQrCode: z.boolean().optional(),
    openBrowser: z.union([z.boolean(), z.enum(["local", "network"])]).optional(),
    autoPort: z.boolean().optional(),
    signalShutdownHandling: z.boolean().optional(),
});

export type ServerUserConfig = z.infer<typeof serverUserConfigSchema>;

export const serverDefaultConfigSchema = z.object({
    baseDirname: z.string().optional(),
    publicDirname: z.string(),
    apiPrefix: z.string(),
    port: z.number(),
    middlewares: z.array(z.custom<express.RequestHandler>()),
    exposeLan: z.boolean(),
    showQrCode: z.boolean(),
    openBrowser: z.union([z.boolean(), z.enum(["local", "network"])]),
    autoPort: z.boolean(),
    signalShutdownHandling: z.boolean(),
});

export type ServerDefaultConfig = z.infer<typeof serverDefaultConfigSchema>;
