import path from "node:path";

export function fixPath(
    mainDirname:string,
    targetPath:string
):string{
    return path.join(mainDirname,targetPath);
}