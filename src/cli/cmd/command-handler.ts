import { NodeController } from "./node-controller.js";

type Data<META> = {
    meta :META;
    args :string[];
    cmd  :string[];
    input:string[];
};

type Handler<META>        = (data:Data<META>)=> void;
export type OnError<META> = (data:Data<META>)=> void | unknown;


export class CommandHandler<META extends unknown = unknown>{
    private nodeController = new NodeController<Handler<META>>();
    private commandUndefined:OnError<META> = (data) => { throw Error(`input is not command [ ${data.input} ]\n`) };
    private commandMetaData!:META;
    
    public set onError(callback:OnError<META>){
        this.commandUndefined = callback;
    }
    public set meta(meta:META){
        this.commandMetaData = meta;
    }

    add(
        name :string,
        handler:Handler<META>
    ){
        const fixName = name.trim();
        this.nodeController.addNode([fixName],handler);
    }
    group(
        groupName :string,
        callback  :(
                add:OmitThisParameter<CommandHandler["add"]>,
                group:OmitThisParameter<CommandHandler["group"]>
            )=>void
    ){
        const fixGroupName = groupName.trim().split(/\s+/);
        this.nodeController.mkDirNode(fixGroupName);

        const add:OmitThisParameter<CommandHandler["add"]> = 
            (name, handler) => {
            const fixName = name.trim(); 

            this.nodeController.addNode([...fixGroupName,fixName], handler);
        };
        const group:OmitThisParameter<CommandHandler["group"]> = 
            (groupName, callback) => {
            const fixName = groupName.trim(); 
            this.group(`${fixGroupName} ${fixName}`, callback);
        };

        callback(add,group);
    }

    private parserCmd(
        input:string[]
    ):{
        cmd:string[],
        args:string[]
    }{
        const cmdOnly :string[]= [];
        const REGEXP = /^(-|--).*/

        for(const i of input){
            if(REGEXP.test(i)) break;
            cmdOnly.push(i);
        }

        return {
                cmd:cmdOnly,
                args:input.slice(cmdOnly.length)
            };
    }
    run(input:string[]){

        const {cmd,args} = this.parserCmd(input);

        for(const i in cmd){
            if(this.nodeController.hasNode(cmd))break;
            const tmp = cmd.pop();
            if(!tmp)continue;
            args.unshift(tmp);
        }

        const data:Data<META> = {
            args,cmd,input,
            meta:this.meta
        }

        if(!cmd[0]){return this.commandUndefined(data)};

        const node = this.nodeController.getNode(cmd);

        if(!(node?.data)){return this.commandUndefined(data)};

        node.data(data);
    }
}

const ch = new CommandHandler()

ch.add("a",()=>{console.log("run => a")});
ch.add("b",()=>{console.log("run => b")});
ch.add("c",()=>{console.log("run => c")});
ch.add("d",()=>{console.log("run => d")});


ch.group("aaa",(add,group)=>{
    add("aaa-1",()=>{console.log("run => aaa-1")});
    group("bbb",(add)=>{
        add("bbb-1",()=>{console.log("run => bbb-1")});
    });
});

// ch.run(["a"]);
// ch.run(["aaa","aaa-1"]);
// ch.run(["aaa"]);
ch.run(["aaaa"])