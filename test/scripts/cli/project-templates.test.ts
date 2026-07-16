import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { appTemplateCopy } from "../../../src/cli/service/template-copy/app/app.js";

const templates = ["static-ts", "api-ts", "realtime-ts"] as const;
const temporaryDirectories: string[] = [];

function createTemporaryDirectory(): string {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "tyoi-project-template-"));
    temporaryDirectories.push(directory);
    return directory;
}

afterEach(() => {
    for (const directory of temporaryDirectories.splice(0)) {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

describe.each(templates)("%s template", (template) => {
    it("create 形式で新しいプロジェクトを生成できる", async () => {
        const target = createTemporaryDirectory();

        await appTemplateCopy({
            target,
            base: process.cwd(),
            option: { template, projectName: "created-project" },
            pack: { version: "9.8.7" },
            app: {
                templatePass: "templates/project",
                destination: "target-project",
            },
        });

        const project = path.join(target, "created-project");
        const packageJson = JSON.parse(fs.readFileSync(path.join(project, "package.json"), "utf8"));
        expect(packageJson.name).toBe("created-project");
        expect(packageJson.dependencies["@donneko/tyoi-server"]).toBe("^9.8.7");
        expect(fs.existsSync(path.join(project, ".gitignore"))).toBe(true);
        expect(fs.existsSync(path.join(project, "_gitignore"))).toBe(false);
    });

    it("init 形式で現在のディレクトリに生成できる", async () => {
        const target = createTemporaryDirectory();

        await appTemplateCopy({
            target,
            base: process.cwd(),
            option: { template, projectName: "initialized-project" },
            pack: { version: "9.8.7" },
            app: { templatePass: "templates/project", destination: "target" },
        });

        const packageJson = JSON.parse(fs.readFileSync(path.join(target, "package.json"), "utf8"));
        expect(packageJson.name).toBe("initialized-project");
        expect(packageJson.dependencies["@donneko/tyoi-server"]).toBe("^9.8.7");
        expect(fs.existsSync(path.join(target, ".gitignore"))).toBe(true);
    });
});

it("CLI が用途別テンプレートを列挙できる", () => {
    const available = fs.readdirSync(path.join(process.cwd(), "templates/project"));
    expect(available).toEqual(expect.arrayContaining(templates));
});
