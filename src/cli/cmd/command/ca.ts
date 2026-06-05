import { CommandsTable } from "../types/command-type.js";


const INITIAL_CA_CONTEXT = {
    count:0,
    message:"こんちゃ！！"
} as const;

export type CaContext = typeof INITIAL_CA_CONTEXT;

export class TEST_ca{
    context:CaContext;
    name:string;
    constructor(ctx:CaContext){
        this.context = ctx;
        this.name = this.constructor.name;
    }

    caA(){
        console.log(this.name,this.caA.name,this.context);
    }
    caB(){
        console.log(this.name,this.caB.name,this.context);
    }
}



export type TEST_CaCommandsMap = {
    "TEST/ca/caA" : null;
    "TEST/ca/caB" : null;
}

type ServiceCommandsTable = CommandsTable<TEST_CaCommandsMap>;
type CaNamespace = "TEST/ca";

export type CaSubServiceExport = {
    namespace:CaNamespace;
    service  :TEST_ca;
    command  :ServiceCommandsTable;
    context  :CaContext;
}

export function initSubServiceCa(): CaSubServiceExport {
    const context = {...INITIAL_CA_CONTEXT};
    const namespace: CaNamespace = "TEST/ca";

    const service = new TEST_ca(context);

    const command:ServiceCommandsTable = {
        "TEST/ca/caA":(_arg) => service.caA(),
        "TEST/ca/caB":(_arg) => service.caB(),
    }

    return {
        namespace,
        service,
        command,
        context
    }
}
