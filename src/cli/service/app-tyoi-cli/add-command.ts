import type { CmdHandler } from "../../types/tyoi-cli.js"

import dev    from "../../command/dev.js";
import create from "../../command/create/main.js";
import init   from "../../command/init/main.js";
import help   from "../../command/help.js";
import run    from "../../command/start.js";
import config from "../../command/config/main.js";
import info   from "../../command/info/main.js";
import def    from "../../command/default.js";

export function addCommand(cmdHandler:CmdHandler){
    cmdHandler.add(""      ,def);
    cmdHandler.add("dev"   ,dev);
    cmdHandler.add("run"   ,run);
    cmdHandler.add("create",create);
    cmdHandler.add("config",config);
    cmdHandler.add("init"  ,init);
    cmdHandler.add("info"  ,info);
    cmdHandler.add("help"  ,help);
}