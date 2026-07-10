import path from "node:path";
import { spawnSync } from "node:child_process";
import { undoPlayground } from "./undoPlayground.js";
import { Logger } from "@donneko/tyoi-logger";

const PLAYGROUND_PASS = "../test/playground";

function getPlaygroundPath(): string {
    const dirname = import.meta.dirname;
    return path.join(dirname, PLAYGROUND_PASS);
}

function testCLI(playgroundPath: string): { args: string[]; ok: boolean }[] {
    const testResult: { args: string[]; ok: boolean }[] = [];
    const run = (args: string[], timeout?: number | undefined) => {
        console.log(`[テスト実行] : `, ...args);
        const result = spawnSync("npx", ["tyoi", ...args], {
            cwd: playgroundPath,
            stdio: "inherit",
            timeout,
        });

        testResult.push({
            args: ["npx", "tyoi", ...args],
            ok: !result.status,
        });
    };
    const undo = () => {
        console.log("[戻しています]");
        undoPlayground(playgroundPath);
    };

    run(["help"]);
    run(["info"]);
    run(["init", "my-app", "--template", "basic-ts"]);
    undo();
    run(["init", "my-app", "--template", "basic-js"]);
    undo();
    run(["create", "my-app", "--template", "basic-ts"]);
    undo();
    run(["create", "my-app", "--template", "basic-js"]);
    undo();
    run(["config", "my-app", "--template", "basic"]);
    run(["run"], 3000);
    run(["dev"], 3000);

    return testResult;
}

function main() {
    const playgroundPath = getPlaygroundPath();

    const results = testCLI(playgroundPath);

    const logger = new Logger();

    const summary = logger.createInfo(
        (() => {
            const ok = results.filter((r) => r.ok);
            const error = results.filter((r) => !r.ok);

            return `テスト回数 : ${results.length}\nOK : ${ok.length}\nERROR : ${error.length}`;
        })()
    );

    logger.window({
        title: "CLIテスト結果の結果",
        content: [
            summary,
            logger.createBar(),
            ...results.map((r) =>
                r.ok ? logger.createSuccess(r.args.join(" ")) : logger.createError(r.args.join(" "))
            ),
        ],
    });
}

main();
