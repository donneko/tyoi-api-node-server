import { expect,describe ,test ,vi} from "vitest";
import { ApiRegistry } from "../../../src/util/api-registry.js"

describe("ApiRegistry",()=>{

    const apiRegistry = new ApiRegistry();
    const onceCallback = vi.fn();
    const onCallback = vi.fn();

    test("once 登録",()=>{
        apiRegistry.once("a",onceCallback);
    });
    test("has 存在確認",()=>{
        apiRegistry.has("a");
    });
    test("emit 着火",()=>{
        apiRegistry.emit("a",{});
    });

    test("on 登録",()=>{
        apiRegistry.on("b",onCallback);
    });
    test("has 存在確認",()=>{
        apiRegistry.has("b");
    });
    test("解除",()=>{
        apiRegistry.off("b");
    });
    test("登録",()=>{
        apiRegistry.emit("b",{});
    });

    expect(onCallback).toHaveBeenCalled();
    expect(onceCallback).toHaveBeenCalled();
});