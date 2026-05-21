import pc from "picocolors";
import stripAnsi from "strip-ansi";


function calcAnsiLength(text:string){
    const cleanText =  stripAnsi(text);
    const ansiLength = (text.length - cleanText.length);
    return ansiLength;
}

function textNormalizer(text:string,width:number):string[] {

    const textList = (Array.isArray(text.split("\n")))?
        text.split("\n"):
        [text];

    let fixedTextList:string[] = [];

    for(const text of textList){

        const overLength = Math.ceil((text.length - calcAnsiLength(text)) / width);
        let fixedText = [];

        if(overLength <= 1){
            fixedTextList.push(text);
            continue;
        }

        // 横幅より長かったら...
        for(let i = 0; i < overLength;i++){
            const tmp = text.slice(i * width,(i + 1) * width);
            fixedText.push(tmp);
        }
        fixedTextList = fixedTextList.concat(fixedText);
    }
    return fixedTextList;
}

type CreateData = {
    type:string;
    message:string;
    createMessage:string;
}

type LoggerCreateData = {
    type:string;
    message:string;
    createMessage:string;
    date:number;
}


function createData(data:CreateData):LoggerCreateData{
    return {
        ...data,
        date: Date.now(),
    };
}


class Logger{
    #addStdout(obj:LoggerCreateData){
        const {createMessage,...stdoutObj } = obj;
        process.stdout.write(JSON.stringify(stdoutObj));
    }
    #addStderr(message:string){
        const out = message.endsWith("\n") ? message : message + "\n";
        process.stderr.write(out);
    }

    info(message: string) {
        const data = this._createInfo(message);
        if(process.stdout.isTTY){
            this.#addStderr(data.createMessage);
        }else{
            this.#addStdout(data);
        }
    }
    _createInfo(message: string){
        const obj = createData({
            type:"INFO",
            message:`[INFO] ${message}`,
            createMessage:`${pc.blueBright("[INFO]")} ${message}`,
        });
        return obj;
    }

    warn(message: string) {
        const data = this._createWarn(message);
        if(process.stdout.isTTY){
            this.#addStderr(data.createMessage);
        }else{
            this.#addStdout(data);
        }
    }
    _createWarn(message: string){
        const obj = createData({
            type: "WARN",
            message: `[WARN] ${message}`,
            createMessage: `${pc.yellow("[WARN]")} ${message}`,
        });
        return obj;
    }

    error(message: string) {
        const data = this._createError(message);
        if(process.stdout.isTTY){
            this.#addStderr(data.createMessage);
        }else{
            this.#addStdout(data);
        }
    }
    _createError(message: string){
        const obj = createData({
            type: "ERROR",
            message: `[ERROR] ${message}`,
            createMessage: `${pc.red("[ERROR]")} ${message}`,
        });
        return obj;
    }

    success(message: string) {
        const data = this._createSuccess(message);
        if(process.stdout.isTTY){
            this.#addStderr(data.createMessage);
        }else{
            this.#addStdout(data);
        }
    }
    _createSuccess(message: string){
        const obj = createData({
            type: "SUCCESS",
            message: `[SUCCESS] ${message}`,
            createMessage: `${pc.green("[SUCCESS]")} ${message}`,
        });
        return obj;
    }

    process(message: string) {
        const data = this._createProcess(message);
        if(process.stdout.isTTY){
            this.#addStderr(data.createMessage);
        }else{
            this.#addStdout(data);
        }
    }
    _createProcess(message: string){
        const obj = createData({
            type: "PROCESS",
            message: `[PROCESS] ${message}`,
            createMessage: `${pc.magentaBright("[PROCESS]")} ${message}`,
        });
        return obj;
    }

    message(message: string) {
        const data = this._createMessage(message);
        if(process.stdout.isTTY){
            this.#addStderr(data.createMessage);
        }else{
            this.#addStdout(data);
        }
    }
    _createMessage(message: string){
        const obj = createData({
            type: "MESSAGE",
            message: `[MESSAGE] ${message}`,
            createMessage: `${pc.gray("[MESSAGE]")} ${message}`,
        });
        return obj;
    }

    system(message: string) {
        const data = this._createSystem(message);
        if(process.stdout.isTTY){
            this.#addStderr(data.createMessage);
        }else{
            this.#addStdout(data);
        }
    }
    _createSystem(message: string){
        const obj = createData({
            type: "SYSTEM",
            message: `[SYSTEM] ${message}`,
            createMessage: `${pc.magentaBright("[SYSTEM]")} ${message}`,
        });
        return obj;
    }

    bar() {
        const data = this._createBar();
        if(process.stdout.isTTY){
            this.#addStderr(data.createMessage);
        }else{
            this.#addStdout(data);
        }
    }
    _createBar(){
        const width = process.stdout.columns ?? 10;
        const line = `${"─".repeat(width - 2)}`;
        const obj = createData({
            type: "BAR",
            message: line,
            createMessage: line,
        });
        return obj;
    }

    window(window:{
        title:string;
        content:LoggerCreateData[];
    }){
        const width = process.stdout.columns ?? 10;
        const createLine = (line:string):string => {
            const repeatNumber = (width - 2) - (line.length - calcAnsiLength(line));
            return `│${line}${" ".repeat(repeatNumber)}│`;
        }

        this.#addStderr(`┌${"─".repeat(width - 2)}┐`);

        textNormalizer(window.title,(width - 2))
            .forEach((text)=>{
                this.#addStderr(createLine(text));
        });

        this.#addStderr(`├${"─".repeat(width - 2)}┤`);

        window.content.
            forEach((lineText)=>{
                textNormalizer(lineText.createMessage,(width - 2)).
                    forEach((text)=>{
                        this.#addStderr(createLine(text));
                });
        });

    this.#addStderr(`└${"─".repeat(width - 2)}┘`);
    }
}

export const logger = new Logger();