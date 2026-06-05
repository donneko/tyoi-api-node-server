import path from "node:path";
import fs from "node:fs"

const PLAYGROUND_PASS = "../test/playground"
const PACK_PASS       = "../"
const TEMPLATE_PASS   = "./template/package.json"

const PACK_REGEX = /^donneko-tyoi-server-[0-9].[0-9].[0-9].tgz$/;

function getPackagePath():string{
    const dirname = import.meta.dirname;
    const packDirPath = path.join(dirname,PACK_PASS);

    const items = fs.readdirSync(packDirPath);

    const packPath = items.find(i => PACK_REGEX.test(i));

    if(!packPath)throw Error("パッケージがありませんでした");

    return packPath;
}

function getPlaygroundPath():string{
    const dirname = import.meta.dirname;
    return path.join(dirname,PLAYGROUND_PASS);
}

function getTemplatePath():string{
    const dirname = import.meta.dirname;
    return path.join(dirname,TEMPLATE_PASS);
}


function clearPlayground(
    playgroundPath:string
){
    fs.rmSync(playgroundPath,{ recursive: true, force: true });
}

function createPlayground(
    playgroundPath:string,
    templatePath:string
){

    fs.copyFileSync(
        templatePath,
        playgroundPath
    );
}

function copyPackage(
    packagePath:string,
    playgroundPath:string
){
    fs.copyFileSync(
        packagePath,
        playgroundPath
    );
}


function main(){
    const packagePath = getPackagePath();
    const playgroundPath = getPlaygroundPath();
    const templatePath = getTemplatePath();

    clearPlayground(playgroundPath);
    createPlayground(
        playgroundPath,
        templatePath
    );

    copyPackage(
        packagePath,
        playgroundPath
    );
}

main();