import { expect,describe ,test} from "vitest";
import { getLanIp } from "../../../src/util/get-lan-ip"


describe("getLanIp",()=>{
    test("",()=>{
        const ip = getLanIp();

        expect(ip).toEqual(expect.any(String));
    })
})