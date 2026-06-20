import type minimist from "minimist"
import type { CommandHandler } from "@donneko/tyoi-cli";

type Data<META> = {
    meta: META;
    args: string[];
    cmd: string[];
    input: string[];
};

export type MetaData = {
    pack:{
        version:string,
        name:string
    },
    cli:{
        cwd:string,
        dirname:string
    },
    option:minimist.ParsedArgs
}

export type CmdMetaData = Data<MetaData>;

export type CmdHandler = CommandHandler<MetaData>;