import { getOption } from "./option.js";
import path from "node:path";
import type { MetaData } from "../../../types/tyoi-cli.type.js";
import getPackData from "./pack-data/main.js";

export async function getMetaData(argv: string[]): Promise<MetaData> {
    return {
        pack: await getPackData(),
        cli: {
            cwd: process.cwd(),
            dirname: path.join(import.meta.dirname, "../../../"),
        },
        option: getOption(argv),
    };
}
