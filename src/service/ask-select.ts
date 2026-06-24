import readline from "readline";

type SelectArgs = {
    message: string;
    selects: string[];
};

class FirstRender {
    private args: SelectArgs;
    private index: number;
    constructor(args: SelectArgs, index: number) {
        this.args = args;
        this.index = index;
    }
    render() {
        process.stdout.write(`${this.args.message}\n`);

        this.args.selects.forEach((choice, i) => {
            const cursor = i === this.index ? "❯" : " ";
            process.stdout.write(`${cursor} ${choice}\n`);
        });
    }
    clear() {
        const len = this.args.selects.length + 1;
        readline.moveCursor(process.stdout, 0, -len);
        readline.clearScreenDown(process.stdout);
    }
}

function reRowRender(len: number, index: number, setText: string) {
    // index の行へ移動
    readline.moveCursor(process.stdout, 0, -(len - index));
    readline.clearLine(process.stdout, 0);
    process.stdout.write(`${setText}\n`);

    // 一旦一番下へ戻る
    readline.moveCursor(process.stdout, 0, len - index - 1);
}

function selectRender(args: SelectArgs, index: number, oldIndex: number) {
    // カーソルは一番した前提。
    const len = args.selects.length;

    reRowRender(len, oldIndex, `  ${args.selects[oldIndex]}`);
    reRowRender(len, index, `❯ ${args.selects[index]}`);
}

export async function askSelect(args: SelectArgs): Promise<number> {
    return new Promise((resolve) => {
        let index = 0;
        let oldIndex = 0;

        const choices = args.selects;

        const firstRender = new FirstRender(args, index);

        const render = () => {
            selectRender(args, index, oldIndex);
        };
        const cleanup = () => {
            if (process.stdin.isTTY) {
                process.stdin.setRawMode(false);
            }
            firstRender.clear();
            process.stdin.off("data", keySelect);
            process.stdin.pause();
        };
        const keySelect = (key: string) => {
            switch (key) {
                case "\u001b[A": {
                    const nextIndex = Math.max(0, index - 1);
                    if (nextIndex === index) break;

                    oldIndex = index;
                    index = nextIndex;
                    render();
                    break;
                }
                case "\u001b[B": {
                    const nextIndex = Math.min(choices.length - 1, index + 1);
                    if (nextIndex === index) break;

                    oldIndex = index;
                    index = nextIndex;
                    render();
                    break;
                }
                case "\r":
                    cleanup();
                    resolve(index);
                    break;
                case "\u0003":
                    cleanup();
                    resolve(-1);
                    break;
            }
        };
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.setEncoding("utf8");
            firstRender.render();
            process.stdin.on("data", keySelect);
        } else {
            resolve(-1);
        }
    });
}
