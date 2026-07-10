import path from "node:path";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { askSelect } from "./ask-select.js";

const PLAYGROUND_PASS = "../test/playground";
const PACK_PASS = "../";
const TEMPLATE_PASS = "./template/package.json";

const PACK_REGEX = /^donneko-tyoi-server-.*\.tgz$/;

async function getPackagePath(): Promise<string> {
    const dirname = import.meta.dirname;
    const packDirPath = path.join(dirname, PACK_PASS);

    const items = fs.readdirSync(packDirPath);

    const packPath = items.filter((i) => PACK_REGEX.test(i));
    if (!packPath) throw Error("パッケージがありませんでした");

    const index = await askSelect({
        message: "使用するパッケージを選択してください",
        selects: packPath,
    });

    if (!process.stdin.isTTY) return packPath[0] as string;
    if (!packPath[index]) throw Error("パッケージが見つかりませんでした");
    return packPath[index];
}

function getPlaygroundPath(): string {
    const dirname = import.meta.dirname;
    return path.join(dirname, PLAYGROUND_PASS);
}

function getTemplatePath(): string {
    const dirname = import.meta.dirname;
    return path.join(dirname, TEMPLATE_PASS);
}

function clearPlayground(playgroundPath: string) {
    const items = fs.readdirSync(playgroundPath);

    items.forEach((item) => {
        const itemPath = path.join(playgroundPath, item);
        fs.rmSync(itemPath, { recursive: true, force: true });
    });
}

function createPlayground(playgroundPath: string, templatePath: string) {
    const name = path.basename(templatePath);
    const fixPath = path.join(playgroundPath, name);
    fs.copyFileSync(templatePath, fixPath);
}

function copyPackage(packagePath: string, playgroundPath: string) {
    const name = path.basename(packagePath);
    const fixPath = path.join(playgroundPath, name);
    fs.copyFileSync(packagePath, fixPath);
}

function editPackageJson(packagePath: string, playgroundPath: string) {
    const packageFileName = path.basename(packagePath);
    const packageJsonPath = path.join(playgroundPath, "package.json");

    const text = fs.readFileSync(packageJsonPath, "utf-8");
    const fixText = text.replaceAll("__PACK_FILE_NAME__", packageFileName);

    fs.writeFileSync(packageJsonPath, fixText);
}

function installNPM(playgroundPath: string) {
    spawnSync("npm", ["install"], {
        cwd: playgroundPath,
        stdio: "inherit",
    });
}

async function main() {
    const packagePath = await getPackagePath();
    const playgroundPath = getPlaygroundPath();
    const templatePath = getTemplatePath();

    clearPlayground(playgroundPath);
    createPlayground(playgroundPath, templatePath);

    copyPackage(packagePath, playgroundPath);

    editPackageJson(packagePath, playgroundPath);

    installNPM(playgroundPath);
}

await main();
