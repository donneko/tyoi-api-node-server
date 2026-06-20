import { CommandHandler } from "@donneko/tyoi-cli";
import type { MetaData } from "../types/tyoi-cli.js"
import { getOnError } from "../service/app-tyoi-cli/on-error.js";
import { getMetaData } from "../service/app-tyoi-cli/meta-data.js";
import { addCommand } from "../service/app-tyoi-cli/add-command.js";

export async function appTyoiCli(){
    const argv = process.argv.slice(2);

    const cmdHandler = new CommandHandler<MetaData>();
    cmdHandler.meta = getMetaData(argv);
    cmdHandler.onError = getOnError;

    addCommand(cmdHandler);
    await cmdHandler.run(argv);
}