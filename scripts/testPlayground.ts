import path from "node:path";
import { spawnSync } from "node:child_process";

const PLAYGROUND_PASS = "../test/playground"


function getPlaygroundPath():string{
    const dirname = import.meta.dirname;
    return path.join(dirname,PLAYGROUND_PASS);
}


function testCLI(
    playgroundPath:string
){
    const run = (...args:string[]) => {
        spawnSync("npx", ["tyoi",...args], {
            cwd: playgroundPath,
            stdio: "inherit",
        });
    }

    run("help");
    run("info");
    run("init");
    run("config");
    run("create");
    // run("run");
    // run("dev");

}

function main(){
    const playgroundPath = getPlaygroundPath();

    testCLI(playgroundPath);
}

main();