import { CodeToMetaManager } from "../../util/code-to-error-message.js";
import { SYSTEM_CODE } from "./data/code-index.js";

export class HttpMetaManager {
    private DATA_MANAGER: CodeToMetaManager<(typeof SYSTEM_CODE)[number]> = new CodeToMetaManager<
        (typeof SYSTEM_CODE)[number]
    >(SYSTEM_CODE);
    getMeta(code: Parameters<CodeToMetaManager<(typeof SYSTEM_CODE)[number]>["getMeta"]>[1]) {
        return this.DATA_MANAGER.getMeta("http", code);
    }
}
