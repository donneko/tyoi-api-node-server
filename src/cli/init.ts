import fs from "node:fs";
import path from "node:path";
import type { MainContextData } from "../main.js";
import { logger } from "../util/logger.js";


type InitContextData = {
    dirname:string;
    projectName:string
}
type PathContexts = {
    templatePath:string;
    targetPath:string;
}

function throwError(message:string):never{
    logger.error(message);
    throw new Error(message);
}

function getProjectName(mainContextData:MainContextData):string{
    logger.bar();
    logger.info("プロジェクト名を検証中です...");

    const projectName = mainContextData.commandArgs[1];

    if(!projectName){
        throwError(`プロジェクト名を引数に入れてください。`);
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
        throwError("プロジェクト名に使える文字は英数字・-・_ のみです。");
    }


    logger.success("プロジェクト名を検証中に成功しました。");
    return projectName;
}

function getPaths(initContextData:InitContextData):PathContexts{

    const {
        dirname,
        projectName
    } = initContextData;

    const templatePath = path.resolve(
        dirname,
        "./templates/basic"
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

    logger.bar();
    logger.info("サーバーのテンプレートを作成しています...");
    const projectName = getProjectName(mainContextData);

    const pathContexts =
        getPaths({
            dirname:mainContextData.mainDirname,
            projectName
        });

    const {
        targetPath
    } = pathContexts;

    logger.bar();
    logger.info(`ディレクトリーの重複を検証中...`)
    if(isTargetPathExists(targetPath)){
        throwError(`指定されたプロジェクトネームのディレクトリーはすでに存在しています。 : ${projectName}`);
    }
    logger.success("ディレクトリーの重複を検証に成功しました。");

    logger.bar();
    logger.info(`プロジェクトを作成中です...`)
    copyTemplate(pathContexts);
    logger.success(`プロジェクトの作成に成功しました。: ${projectName}`);

    logger.bar();
    logger.success(`サーバーのテンプレートを作成に成功しました。`);
    logger.bar();

}
