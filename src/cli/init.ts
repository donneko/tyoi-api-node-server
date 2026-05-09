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
type LoggerWrapper = {
    fun: () => unknown;
    process:string;
    success:string;
}

function throwError(message:string):never{
    // ここでエラーを表示するのは仮です。
    logger.error(message);
    throw new Error(message);
}

function loggerWrapper(loggerWrapper:LoggerWrapper):unknown{

    const {
        fun,
        process,
        success
    } = loggerWrapper;
    logger.bar();
    logger.process(process);
    const funReturn = fun();
    logger.success(success);

    return funReturn;
}

function getProjectName(mainContextData:MainContextData):string{
    logger.bar();
    logger.process("プロジェクト名を検証中です...");

    const projectName = mainContextData.commandArgs[1];

    if(!projectName){
        throwError(`プロジェクト名を引数に入れてください。`);
    }

    if (!/^[a-zA-Z0-9-]+$/.test(projectName)) {
        throwError("プロジェクト名に使える文字は英数字・- のみです。");
    }


    logger.success("プロジェクト名の検証に成功しました。");
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
function validateTemplatePath(templatePath:string){
    if (!fs.existsSync(templatePath)) {
        throwError(`テンプレートが見つかりません: ${templatePath}`);
    }
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

function replaceProjectName(pathContexts: PathContexts, projectName: string): void {
    const packageJsonPath = path.join(pathContexts.targetPath, "package.json");

    if (!fs.existsSync(packageJsonPath)) throwError(`package.json が見つかりませんでした。`);

    const text = fs.readFileSync(packageJsonPath, "utf-8");

    fs.writeFileSync(
        packageJsonPath,
        text.replaceAll("__PROJECT_NAME__", projectName)
    );
}

export default function serverInit(mainContextData:MainContextData){

    logger.bar();
    logger.process("サーバーのテンプレートを作成しています...");
    const projectName = getProjectName(mainContextData);

    const pathContexts =
        getPaths({
            dirname:mainContextData.mainDirname,
            projectName
        });

    const {
        templatePath,
        targetPath
    } = pathContexts;

    loggerWrapper({
        process:`ディレクトリーの重複を検証中...`,
        fun:() => {
            if(isTargetPathExists(targetPath)){
                throwError(`指定されたプロジェクトネームのディレクトリーはすでに存在しています。 : ${projectName}`);
            }
        },
        success:`ディレクトリーの重複チェックに成功しました。`
    });

    loggerWrapper({
        process:`テンプレートの存在を検証中...`,
        fun:() => validateTemplatePath(templatePath),
        success:`テンプレートの存在チェックに成功しました。`
    });

    loggerWrapper({
        process:`プロジェクトを作成中です...`,
        fun:() => copyTemplate(pathContexts),
        success:`プロジェクトの作成に成功しました。`
    });

    loggerWrapper({
        process:`プロジェクトを編集中です...`,
        fun:() => replaceProjectName(pathContexts,projectName),
        success:`プロジェクトの編集に成功しました。`
    });

    logger.bar();
    logger.success(`サーバーのテンプレートを作成に成功しました。`);
    logger.bar();

}
