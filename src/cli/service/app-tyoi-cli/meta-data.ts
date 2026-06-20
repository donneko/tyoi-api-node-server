import { getOption } from "./option.js"
import path from "node:path";
import type { MetaData } from "../../types/tyoi-cli.js"

export function getMetaData(argv:string[]):MetaData{
    return {
        pack:{
            version:"0.0.6",
            name:""
        },
        cli:{
            cwd:process.cwd(),
            dirname:path.join(import.meta.dirname,"../../../")
        },
        option:getOption(argv)
    }
}
