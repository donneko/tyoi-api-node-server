import { expect,describe ,test } from "vitest";
import { CodeToMetaManager } from "../../../src/util/code-to-error-message.js"

describe("CodeToMetaManager",()=>{

    const TEST_DATA = [
        {
            code: 1,
            message: "aaa-1",
            description: "1-1-1",
            label:"aaa"
        },
        {
            code: 2,
            message: "aaa-2",
            description: "2-2-2",
            label:"aaa"
        },
        {
            code:1,
            message: "bbb-1",
            description: "1-1-1",
            label:"bbb"
        }
    ] as const;

    const codeToMetaManager = new CodeToMetaManager(TEST_DATA);

    test("getMeta データが正常に取得できる",()=>{
        const data = codeToMetaManager.getMeta("aaa",1);

        expect(data).toEqual({
            code: 1,
            message: "aaa-1",
            description: "1-1-1",
            label:"aaa"
        });
    });

    test("getMeta データが正常に取得できる",()=>{
        const data = codeToMetaManager.getMeta("aaa",2);

        expect(data).toEqual({
            code: 2,
            message: "aaa-2",
            description: "2-2-2",
            label:"aaa"
        });
    });

    test("getMeta データが正常に取得できる",()=>{
        const data = codeToMetaManager.getMeta("bbb",1);

        expect(data).toEqual({
            code: 1,
            message: "bbb-1",
            description: "1-1-1",
            label:"bbb"
        });
    });
});