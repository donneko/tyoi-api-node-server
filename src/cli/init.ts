import fs from "node:fs";
import path from "node:path";
import type { MainContextData } from "../main.js";
import { logger } from "../util/logger.js";

const templateTable = {
    "basic":"./templates/basic",
} as const

type TemplateValue = typeof templateTable[keyof typeof templateTable];

type InitContextData = {
    dirname:string;
    projectName:string;
    templatePass:TemplateValue;
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

function getTemplatePath(mainContextData:MainContextData):TemplateValue{
    const templateName:string | undefined | keyof typeof templateTable = mainContextData.optionArgs?.template;

    if(!templateName)return templateTable["basic"];
    if(!Object.hasOwn(templateTable,templateName)) throwError(`コピー元のテンプレートが見つかりません`);

    logger.info(`選択されたテンプレート[${templateName}]`);
    return templateTable[(templateName as keyof typeof templateTable)];
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
        projectName,
        templatePass
    } = initContextData;

    const templatePath = path.resolve(
        dirname,
        templatePass
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

function showNextSteps(projectName: string): void {
    logger.bar();
    logger.success("次のコマンドで起動できます。");
    logger.info(`cd ${projectName}`);
    logger.info("npm install");
    logger.info("npm run dev");
    logger.bar();
}

export default function serverInit(mainContextData:MainContextData){

    logger.bar();
    logger.process("サーバーのテンプレートを作成しています...");
    const projectName = getProjectName(mainContextData);
    const templatePass = getTemplatePath(mainContextData);

    const pathContexts =
        getPaths({
            dirname:mainContextData.mainDirname,
            projectName,
            templatePass
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

    showNextSteps(projectName);
}
