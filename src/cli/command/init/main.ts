import type { CmdMetaData } from "../../../types/tyoi-cli.type.js";
import { showNextSteps } from "./service/next-steps.js";
import copyTemplate from "../../service/template-copy/main.js";

export default async function serverInit(data: CmdMetaData) {
    const TEMPLATE_PASS = "../templates/project";

    const mainDirname = data.meta.cli.dirname;
    const processCwd = data.meta.cli.cwd;

    const option = data.meta.option;
    const projectName = data.args[0];

    const pack = data.meta.pack;

    await copyTemplate({
        target: processCwd,
        base: mainDirname,
        option: {
            template: option?.template,
            ...(projectName !== undefined ? { projectName } : {}),
        },
        pack: {
            version: pack.version,
        },
        app: {
            templatePass: TEMPLATE_PASS,
        },
    });

    showNextSteps();
}
