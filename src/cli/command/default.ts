import { Logger } from "@donneko/tyoi-logger";
import type { CmdMetaData } from "../types/tyoi-cli.js";

import help from "./help.js";
import run from "./start.js";

export default async function main(data:CmdMetaData){
    if(data.meta.option?.version){
        const logger = new Logger();
        logger.system(data.meta.pack.version);
        return;
    }
    if(data.meta.option?.help){
        help(data);
        return;
    }
    await run(data);
}