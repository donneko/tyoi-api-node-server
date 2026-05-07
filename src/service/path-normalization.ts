import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 公開するpathを正常にする関数
 * @param baseUrl ベースURLのパッチもとになるURL
 * @param publicDirname 公開するディレクトリー
 * @throws Error
 * @example
 * pathNormalization(import.meta.url,"main");
 * @returns baseUrl + "public" + publicDirname;
 */
export function pathNormalization(baseUrl:string,publicDirname:string):string{
    const filename = fileURLToPath(baseUrl);
    const dirname  = path.dirname(filename);

    const deliveryBasePath = path.resolve(dirname, "public");
    const deliveryPath = path.resolve(deliveryBasePath, publicDirname);

    if (
        deliveryPath !== deliveryBasePath &&
        !deliveryPath.startsWith(deliveryBasePath + path.sep)
    ) {
        throw new Error("Invalid publicDirname: outside public directory");
    }

    return deliveryPath;
}