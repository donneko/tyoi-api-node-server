import path from "node:path";
import { Server } from "../app/server.js";
import type { MainContextData } from "../main.js"
import { askSelect } from "../service/ask-select.js";
import { scanConfigFiles } from "../service/scan-config-files.js";

type RequestNameList = "GET:/test" | "GET:/test/a" | "GET:/a";



async function getConfigFile(processCwd:string):Promise<string|null|undefined>{
    const files = await scanConfigFiles(processCwd)

    if(files.length === 0)return null;

    if(files.length > 1){
        const index = await askSelect({
            message:"使用する設定ファイルを選択してください。",
            selects:files
        });
        return index === -1?null:files[index];
    }

    return files[0];
}

export default async function runStartServer(mainContextData:MainContextData){
    const file = await getConfigFile(mainContextData.processCwd);
    let useConfig = {};

    if(file){
        const filePath = path.join(mainContextData.processCwd,file)
        useConfig = await import(filePath).then((r)=> r.default);
    }

    // サーバー作成
    const server = new Server<RequestNameList>({
        ...useConfig,
        ...mainContextData.optionArgs,
        ...{baseDirname:mainContextData.mainDirname}
    });

    // サーバー起動
    await server.startServer();

}