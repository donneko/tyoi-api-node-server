import path from "node:path";

/**
 * 公開するpathにする関数
 * @param baseDirname 基準になるディレクトリー
 * @param publicDirname 公開するディレクトリーのパス
 */
export function pathNormalization(baseDirname:string,publicDirname:string):string{

    // 利用者が危ないパスにしても、このサーバーは開発用なので割り切ります。
    const deliveryPath = path.resolve(baseDirname, publicDirname);

    return deliveryPath;
}