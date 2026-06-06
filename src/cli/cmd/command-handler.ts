import { NodeController } from "./node-controller.js";

type data = {
    meta :{},
    args :any,
    cmds :string[],
    input:string[]
};

type Handler = ()=>void;


export class CommandHandler{
    private nodeController = new NodeController<Handler>();
    

    add(
        name :string,
        handler:Handler
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

    private parserCmds(cmds:string[]):string[]{
        const cmdOnly :string[]= [];
        const REGEXP = /^(-|--).*/

        for(const cmd of cmds){
            if(REGEXP.test(cmd)) break;
            cmdOnly.push(cmd);
        }

        return cmdOnly;
    }
    run(cmds:string[]){

        const cmdOnly = this.parserCmds(cmds);

        for(const i in cmdOnly){
            if(this.nodeController.hasNode(cmdOnly))break;
            cmdOnly.pop();
        }

        if(!cmdOnly[0]) return;

        const node = this.nodeController.getNode(cmdOnly);

        if(!node.data) throw Error(`input is not command [ ${cmds} ]\n`);
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


ch.run(["a"]);
ch.run(["aaa","aaa-1"]);
ch.run(["aaa"]);
ch.run(["aaaa"])