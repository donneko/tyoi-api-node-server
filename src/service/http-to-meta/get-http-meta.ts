import { CodeToMetaManager } from "../../util/code-to-error-message.js";
import { HTTP_ERROR_CODE } from "./data/error-code-index.js";



export class getHttpToMeta{
    private DATA_MANAGER:CodeToMetaManager<typeof HTTP_ERROR_CODE[number]> = new CodeToMetaManager<typeof HTTP_ERROR_CODE[number]>(HTTP_ERROR_CODE);
    getMeta(...arg:Parameters<(typeof this.DATA_MANAGER)>){
    }
}