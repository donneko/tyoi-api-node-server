import pc from "picocolors";

function textNormalizer(text:string,width:number):string[] {

    const textList = (Array.isArray(text.split("\n")))?
        text.split("\n"):
        [text];

    let fixdTextList:string[] = [];

    for(const text of textList){
        const overLength = Math.ceil(text.length / width);
        let fixdText = [];

        if(overLength <= 1){
            fixdTextList.push(text);
            continue;
        }

        // 横幅より長かったら...
        for(let i = 0; i < overLength;i++){
            const tmp = text.slice(i * width,(i + 1) * width);
            fixdText.push(tmp);
        }
        fixdTextList = fixdTextList.concat(fixdText);
    }
    return fixdTextList;
}

type TYYData = {
    type:string;
    message:string;
}

function nonTYYData(data:TYYData):string{
    return JSON.stringify({
        ...data,
        ...{
            date: Date.now(),
            type:null,
            message:null,
        }
    })
}


class Logger{
    #addStdout(json:string){
        process.stdout.write(json);
    }
    #addStderr(message:string){
        process.stderr.write(message);
    }

    info(message: string) {
        const data = this._createInfo(message);
        if(data){
            this.#addStderr(data);
        }
    }
    _createInfo(message: string):string | null{
        if(process.stdout.isTTY){
            return `${pc.blueBright("[INFO]")} ${message}`;
        }else{
            const json = nonTYYData({
                type:"INFO",
                message:message
            });
            this.#addStdout(json);
            return null;
        }
    }

    warn(message: string) {
        const data = this._createWarn(message);
        if(data){
            this.#addStderr(data);
        }
    }
    _createWarn(message: string):string | null{
        if(process.stdout.isTTY){
            return `${pc.yellow("[WARN]")} ${message}`;
        }else{
            const json = nonTYYData({
                type:"WARN",
                message:message
            });
            this.#addStdout(json);
            return null;
        }
    }

    error(message: string) {
        const data = this._createError(message);
        if(data){
            this.#addStderr(data);
        }
    }
    _createError(message: string):string | null{
        if(process.stdout.isTTY){
            return `${pc.red("[ERROR]")} ${message}`;
        }else{
            const json = nonTYYData({
                type:"ERROR",
                message:message
            });
            this.#addStdout(json);
            return null;
        }
    }

    success(message: string) {
        const data = this._createSuccess(message);
        if(data){
            this.#addStderr(data);
        }
    }
    _createSuccess(message: string):string | null{
        if(process.stdout.isTTY){
            return `${pc.green("[SUCCESS]")} ${message}`;
        }else{
            const json = nonTYYData({
                type:"SUCCESS",
                message:message
            });
            this.#addStdout(json);
            return null;
        }
    }

    process(message: string) {
        const data = this._createProcess(message);
        if(data){
            this.#addStderr(data);
        }
    }
    _createProcess(message: string):string | null{
        if(process.stdout.isTTY){
            return `${pc.magentaBright("[PROCESS]")} ${message}`;
        }else{
            const json = nonTYYData({
                type:"PROCESS",
                message:message
            });
            this.#addStdout(json);
            return null;
        }
    }

    message(message: string) {
        const data = this._createMessage(message);
        if(data){
            this.#addStderr(data);
        }
    }
    _createMessage(message: string):string | null{
        if(process.stdout.isTTY){
            return `${pc.gray("[MESSAGE]")} ${message}`;
        }else{
            const json = nonTYYData({
                type:"MESSAGE",
                message:message
            });
            this.#addStdout(json);
            return null;
        }
    }

    system(message: string) {
        const data = this._createSystem(message);
        if(data){
            this.#addStderr(data);
        }
    }
    _createSystem(message: string):string | null{
        if(process.stdout.isTTY){
            return `${pc.magentaBright("[SYSTEM]")} ${message}`;
        }else{
            const json = nonTYYData({
                type:"SYSTEM",
                message:message
            });
            this.#addStdout(json);
            return null;
        }
    }

    bar() {
        const data = this._createBar();
        if(process.stdout.isTTY){
            this.#addStderr(data);
        }
    }
    _createBar() {
        const width = process.stdout.columns ?? 10;
        return `${"─".repeat(width - 2)}`;
    }

    window(window:{
        title:string;
        content:string[];
    }){
        const width = process.stdout.columns ?? 10;
        const createLine = (line:string):string => {
            return `│${line}${" ".repeat((width - 2) - line.length)}│`;
        }

        console.log(`┌${"─".repeat(width - 2)}┐`);

        textNormalizer(window.title,(width - 2))
            .forEach((text)=>{
                console.log(createLine(text));
        });

        console.log(`├${"─".repeat(width - 2)}┤`);

        window.content.forEach((lineText)=>{
            textNormalizer(lineText,(width - 2))
                .forEach((text)=>{
                    console.log(createLine(text));
            });
        })

        console.log(`└${"─".repeat(width - 2)}┘`);
    }
}

export const logger = new Logger();

logger.window({
    title:"title",
    content:[
        logger._createBar(),
        logger._createInfo("aaaaa") ?? "",
        logger._createSuccess("eeeeeeeeee") ?? ""
    ]
})