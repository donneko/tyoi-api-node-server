import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { copyFolder } from "../../../src/cli/service/template-copy/shell/copy-folder.js";

const temporaryDirectories: string[] = [];

afterEach(() => {
    for (const directory of temporaryDirectories.splice(0)) {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

describe("copyFolder", () => {
    it("_gitignore を .gitignore としてコピーする", async () => {
        const root = fs.mkdtempSync(path.join(os.tmpdir(), "tyoi-template-"));
        temporaryDirectories.push(root);

        const template = path.join(root, "template");
        const project = path.join(root, "project");
        fs.mkdirSync(template);
        fs.mkdirSync(project);
        fs.writeFileSync(path.join(template, "_gitignore"), "node_modules/\n");

        await copyFolder(template, project);

        expect(fs.readFileSync(path.join(project, ".gitignore"), "utf8")).toBe("node_modules/\n");
        expect(fs.existsSync(path.join(project, "_gitignore"))).toBe(false);
    });
});
