import type { CmdHandler } from "../../types/tyoi-cli.type.js";

import dev from "../../command/dev.js";
import create from "../../command/create/main.js";
import init from "../../command/init/main.js";
import help from "../../command/help.js";
import run from "../../command/start.js";
import config from "../../command/config/main.js";
import info from "../../command/info/main.js";
import def from "../../command/default.js";

export function addCommand(cmdHandler: CmdHandler) {
    cmdHandler
        .add("", def)
        .add("dev", dev)
        .add("run", run)
        .add("create", create)
        .add("config", config)
        .add("init", init)
        .add("info", info)
        .add("help", help);
}
