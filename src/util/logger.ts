import pc from "picocolors";
import stringWidth from "string-width";
import stripAnsi from "strip-ansi";

function getWidth():number{
    const number = Number(process.env.COLUMNS);
    const envColumns = Number.isFinite(number)? number : null;

    return process.stdout.columns ??
            envColumns ??
            80;
}

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
    const headerLength = stringWidth(stripAnsi(textList[0]?? "").match(/\[[a-zA-Z1-9]*\]\s/)?.[0] ?? "");

    for(const text of textList){
        const index = textList.indexOf(text);

        const calcAnsiLengthValue = calcAnsiLength(text);
        const textWidth   = stringWidth(text);
        const overContent = Math.ceil(textWidth / width);
        const overHeader  = (overContent - 1) * headerLength;
        const textLength  = (textWidth - headerLength) + overHeader + calcAnsiLengthValue;

        let fixedText = [];

        if(textLength <= width){
            const prefix = " ".repeat(index === 0?0:headerLength)
            fixedTextList.push(`${prefix}${text}`);
            continue;
        }

        // 横幅より長かったら...
        for(let i = 0; i < textLength;){
            const prefix = " ".repeat(i >= width?headerLength:0);
            const end = width + (i >= width? -headerLength:calcAnsiLengthValue);

            const tmp = `${prefix}${text.slice(i, i + end)}`;
            fixedText.push(tmp);
            i += width;
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

export type LoggerCreateData = {
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
    #loggerSelectProcess(data:LoggerCreateData){
        if((process.stdout.isTTY)){
            this.#addStderr(data.createMessage);
        }else{
            this.#addStdout(data);
        }

        return data;
    }

    info(message: string):LoggerCreateData{
        const data = this.createInfo(message);
        return this.#loggerSelectProcess(data);
    }
    createInfo(message: string):LoggerCreateData{
        const obj = createData({
            type:"INFO",
            message:`[INFO] ${message}`,
            createMessage:`${pc.blueBright("[INFO]")} ${message}`,
        });
        return obj;
    }

    warn(message: string):LoggerCreateData{
        const data = this.createWarn(message);
        return this.#loggerSelectProcess(data);
    }
    createWarn(message: string):LoggerCreateData{
        const obj = createData({
            type: "WARN",
            message: `[WARN] ${message}`,
            createMessage: `${pc.yellow("[WARN]")} ${message}`,
        });
        return obj;
    }

    error(message: string):LoggerCreateData{

        const data = this.createError(message);

        return this.#loggerSelectProcess(data);
    }
    createError(message: string):LoggerCreateData{
        const obj = createData({
            type: "ERROR",
            message: `[ERROR] ${message}`,
            createMessage: `${pc.red("[ERROR]")} ${message}`,
        });

        return obj;
    }

    success(message: string):LoggerCreateData{
        const data = this.createSuccess(message);
        return this.#loggerSelectProcess(data);
    }
    createSuccess(message: string):LoggerCreateData{
        const obj = createData({
            type: "SUCCESS",
            message: `[SUCCESS] ${message}`,
            createMessage: `${pc.green("[SUCCESS]")} ${message}`,
        });
        return obj;
    }

    process(message: string):LoggerCreateData{
        const data = this.createProcess(message);
        return this.#loggerSelectProcess(data);
    }
    createProcess(message: string):LoggerCreateData{
        const obj = createData({
            type: "PROCESS",
            message: `[PROCESS] ${message}`,
            createMessage: `${pc.magentaBright("[PROCESS]")} ${message}`,
        });
        return obj;
    }

    message(message: string):LoggerCreateData{
        const data = this.createMessage(message);
        return this.#loggerSelectProcess(data);
    }
    createMessage(message: string):LoggerCreateData{
        const obj = createData({
            type: "MESSAGE",
            message: `[MESSAGE] ${message}`,
            createMessage: `${pc.gray("[MESSAGE]")} ${message}`,
        });
        return obj;
    }

    system(message: string):LoggerCreateData{
        const data = this.createSystem(message);
        return this.#loggerSelectProcess(data);
    }
    createSystem(message: string):LoggerCreateData{
        const obj = createData({
            type: "SYSTEM",
            message: `[SYSTEM] ${message}`,
            createMessage: `${pc.magentaBright("[SYSTEM]")} ${message}`,
        });
        return obj;
    }

    bar():LoggerCreateData{
        const data = this.createBar();
        return this.#loggerSelectProcess(data);
    }
    createBar():LoggerCreateData{
        const width = getWidth();
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
    }):void{

        if(!(process.stdout.isTTY)){
            window.content.forEach((data)=>{
                this.#loggerSelectProcess(data)
            });
            return;
        }

        const width = getWidth();
        const createLine = (line:string):string => {
            const repeatNumber = (width - 2) - stringWidth(line);
            const safeRepeatNumber = repeatNumber >= 0 ? repeatNumber : 0;
            return `│${line}${" ".repeat(safeRepeatNumber)}│`;
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