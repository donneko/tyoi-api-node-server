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

        
        this.nodeController.getNode(cmds);
    }
}

const ch = new CommandHandler()