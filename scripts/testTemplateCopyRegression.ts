import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";

type CliResult = {
    args:string[],
    cwd:string,
    status:number | null,
    stdout:string,
    stderr:string
};

const require = createRequire(import.meta.url);
const repoRoot = path.join(import.meta.dirname,"..");
const cliEntry = path.join(repoRoot,"src/main.ts");
const packageJsonPath = path.join(repoRoot,"package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath,"utf-8")) as {version:string};
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(),"tyoi-template-copy-"));
const tsxLoader = require.resolve("tsx");

function createCaseDir(name:string):string{
    const caseDir = path.join(tmpRoot,name);
    fs.mkdirSync(caseDir);
    return caseDir;
}

function runCli(cwd:string,args:string[]):CliResult{
    const result = spawnSync(
        process.execPath,
        [
            "--import",
            tsxLoader,
            cliEntry,
            ...args
        ],
        {
            cwd,
            encoding:"utf-8",
            env:{
                ...process.env,
                NO_COLOR:"1"
            }
        }
    );

    return {
        args,
        cwd,
        status:result.status,
        stdout:result.stdout,
        stderr:result.stderr
    };
}

function formatResult(result:CliResult):string{
    return [
        `cwd: ${result.cwd}`,
        `cmd: tyoi ${result.args.join(" ")}`,
        `status: ${result.status}`,
        `stdout:\n${result.stdout}`,
        `stderr:\n${result.stderr}`
    ].join("\n");
}

function assertOk(result:CliResult):void{
    assert.equal(result.status,0,formatResult(result));
}

function assertFailed(result:CliResult):void{
    assert.notEqual(result.status,0,formatResult(result));
}

function assertPathExists(filePath:string):void{
    assert.equal(fs.existsSync(filePath),true,`${filePath} should exist`);
}

function assertPathMissing(filePath:string):void{
    assert.equal(fs.existsSync(filePath),false,`${filePath} should not exist`);
}

function readText(filePath:string):string{
    return fs.readFileSync(filePath,"utf-8");
}

function readPackageJson(projectPath:string):{
    name:string,
    dependencies?:Record<string,string>
}{
    return JSON.parse(readText(path.join(projectPath,"package.json"))) as {
        name:string,
        dependencies?:Record<string,string>
    };
}

function assertPackageJsonReplaced(projectPath:string,projectName:string):void{
    const packageText = readText(path.join(projectPath,"package.json"));
    assert.equal(packageText.includes("__PROJECT_NAME__"),false);
    assert.equal(packageText.includes("__TYOI_SERVER_VERSION__"),false);

    const packageData = readPackageJson(projectPath);
    assert.equal(packageData.name,projectName);
    assert.equal(
        packageData.dependencies?.["@donneko/tyoi-server"],
        `^${packageJson.version}`
    );
}

function assertProjectTemplate(projectPath:string,template:string,projectName:string):void{
    assertPathExists(path.join(projectPath,"package.json"));
    assertPathExists(path.join(projectPath,"public","main","index.html"));
    assertPathExists(path.join(projectPath,"tyoi.config.js"));

    if(template === "basic-ts"){
        assertPathExists(path.join(projectPath,"src","server.ts"));
        assertPathExists(path.join(projectPath,"tsconfig.json"));
    }else{
        assertPathExists(path.join(projectPath,"src","server.js"));
    }

    assertPackageJsonReplaced(projectPath,projectName);
}

function testCreate(template:"basic-js" | "basic-ts"):void{
    const cwd = createCaseDir(`create-${template}`);
    const projectName = `my-${template}`;
    const result = runCli(cwd,[
        "create",
        projectName,
        "--template",
        template
    ]);

    assertOk(result);
    assertProjectTemplate(path.join(cwd,projectName),template,projectName);
}

function testInit(template:"basic-js" | "basic-ts"):void{
    const cwd = createCaseDir(`init-${template}`);
    const projectName = `init-${template}`;
    const result = runCli(cwd,[
        "init",
        projectName,
        "--template",
        template
    ]);

    assertOk(result);
    assertProjectTemplate(cwd,template,projectName);
}

function testConfig():void{
    const cwd = createCaseDir("config-basic");
    const result = runCli(cwd,[
        "config",
        "--template",
        "basic"
    ]);

    assertOk(result);
    assertPathExists(path.join(cwd,"tyoi.config.js"));
    assertPathMissing(path.join(cwd,"package.json"));
}

function testInvalidTemplateDoesNotCopy():void{
    const cwd = createCaseDir("invalid-template");
    const result = runCli(cwd,[
        "create",
        "broken",
        "--template",
        "missing-template"
    ]);

    assertFailed(result);
    assertPathMissing(path.join(cwd,"broken"));
    assert.deepEqual(fs.readdirSync(cwd),[]);
}

function testCreateRejectsExistingDirectory():void{
    const cwd = createCaseDir("create-existing-directory");
    const projectPath = path.join(cwd,"existing");
    fs.mkdirSync(projectPath);

    const result = runCli(cwd,[
        "create",
        "existing",
        "--template",
        "basic-js"
    ]);

    assertFailed(result);
    assertPathMissing(path.join(projectPath,"package.json"));
}

function testConfigOverwritesExistingFile():void{
    const cwd = createCaseDir("config-existing-file");
    const configPath = path.join(cwd,"tyoi.config.js");
    fs.writeFileSync(configPath,"const sentinel = true;\n");

    const result = runCli(cwd,[
        "config",
        "--template",
        "basic"
    ]);

    assertOk(result);

    const text = readText(configPath);
    assert.equal(text.includes("sentinel"),false);
    assert.equal(text.includes("defineConfig"),true);
}

function main():void{
    try {
        testCreate("basic-js");
        testCreate("basic-ts");
        testInit("basic-js");
        testInit("basic-ts");
        testConfig();
        testInvalidTemplateDoesNotCopy();
        testCreateRejectsExistingDirectory();
        testConfigOverwritesExistingFile();

        console.log("template copy regression smoke passed");
    } finally {
        if(process.env.TYOI_KEEP_TEMPLATE_COPY_SMOKE !== "1"){
            fs.rmSync(tmpRoot,{recursive:true,force:true});
        }else{
            console.log(`kept smoke directory: ${tmpRoot}`);
        }
    }
}

main();
