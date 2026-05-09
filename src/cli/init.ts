import fs from "node:fs";
import path from "node:path";
import { MainContextData } from "../main.js";


type InitContextData = {
    dirname:string;
    projectName:string
}
type PathContexts = {
    templatePath:string;
    targetPath:string;
}

function validationProjectName(mainContextData:MainContextData):string{

    const initArgs = mainContextData.commandArgs.slice(1);
    // プロジェクト名がない場合
    if( !initArgs[0] || initArgs[0] === "" ){
        console.log(`プロジェクト名を引数に入れてください。`);
        process.exit(1);
    }

    return initArgs[0];
}

function getPaths(initContextData:InitContextData):PathContexts{
    const {
        dirname,
        projectName
    } = initContextData;

    const templatePath = path.resolve(
        dirname,
        "../templates/basic"
    );

    const targetPath = path.resolve(
        process.cwd(),
        projectName
    );

    return {
        templatePath,
        targetPath
    }
}

function isTargetPathExists(targetPath:string):boolean{
    return fs.existsSync(targetPath);
}

function copyTemplate(pathContexts:PathContexts){
    const {
        templatePath,
        targetPath
    } = pathContexts;

    fs.cpSync(templatePath, targetPath, {
        recursive: true
    });
}

export default function serverInit(mainContextData:MainContextData){

    const projectName = validationProjectName(mainContextData);

    const pathContexts = getPaths({
        dirname:mainContextData.mainDirname,
        projectName
    });

    const {
        targetPath
    } = pathContexts;

    if(isTargetPathExists(targetPath)){
        console.log(`Already exists: ${projectName}`);
        process.exit(1);
    }

    copyTemplate(pathContexts);

    console.log(`完了: ${projectName}`);
}
