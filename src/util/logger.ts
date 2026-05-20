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


export const logger = {
    info(message: string) {
        console.log(
            `${logger._createInfo(message)}`
        );
    },
    _createInfo(message: string):string{
        return `${pc.blueBright("[INFO]")} ${message}`;
    },

    warn(message: string) {
        console.log(
            `${logger._createWarn(message)}`
        );
    },
    _createWarn(message: string):string{
        return `${pc.yellow("[WARN]")} ${message}`;
    },

    error(message: string) {
        console.log(
            `${logger._createError(message)}`
        );
    },
    _createError(message: string):string{
        return `${pc.red("[ERROR]")} ${message}`;
    },

    success(message: string) {
        console.log(
            `${logger._createSuccess(message)}`
        );
    },
    _createSuccess(message: string):string{
        return `${pc.green("[SUCCESS]")} ${message}`;
    },

    process(message: string) {
        console.log(
            `${logger._createProcess(message)}`
        );
    },
    _createProcess(message: string):string{
        return `${pc.magentaBright("[PROCESS]")} ${message}`;
    },

    message(message: string) {
        console.log(
            `${logger._createMessage(message)}`
        );
    },
    _createMessage(message: string):string{
        return `${pc.gray("[MESSAGE]")} ${message}`;
    },

    system(message: string) {
        console.log(
            `${logger._createSystem(message)}`
        );
    },
    _createSystem(message: string):string{
        return `${pc.magentaBright("[SYSTEM]")} ${message}`;
    },

    bar() {
        const width = process.stdout.columns ?? 10;
        console.log("─".repeat(width));
    },

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
} as const;