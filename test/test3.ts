type SelectArgs = {
    message:string;
    selects:string[];
}

function selectRender(args:SelectArgs,index:number) {
    console.clear();
    console.log(`${args.message}\n`);

    args.selects.forEach((choice, i) => {
        const cursor = i === index ? "❯" : " ";
        console.log(`${cursor} ${choice}`);
    });
}

async function select(args:SelectArgs):Promise<number> {

    return new Promise((resolve,reject) => {

        let index = 0;
        const choices = args.selects;

        const render = () => {
            selectRender(args,index);
        }
        const cleanup = () => {
            if (process.stdin.isTTY) {
                process.stdin.setRawMode(false);
            }

            process.stdin.off("data", keySelect);
            process.stdin.pause();
        };
        const keySelect = (key:string ) => {
            switch (key) {
                case "\u001b[A":
                    index = Math.max(0, index - 1);
                    render();
                    break;
                case "\u001b[B":
                    index = Math.min(choices.length - 1, index + 1);
                    render();
                    break;
                case "\r":
                    console.clear();
                    cleanup();
                    resolve(index);
                    break;
                case "\u0003":
                    cleanup();
                    reject(new Error("User cancelled"));
                    break;
                }
            }

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding("utf8");
        render();
        process.stdin.on("data",keySelect);
    })
}

const index = await select({
    message:"選択してください",
    selects:["選択肢1","選択肢2","選択肢3"]
})
console.log(index);