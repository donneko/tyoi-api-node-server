import { NodeController } from "./node-controller.js";

export type Data<META> = {
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
    ):this{
        const fixName = (name.trim().length)?name.trim():"";

        this.nodeController.addNode([fixName],handler);

        return this;
    }
    group(
        groupName :string,
        callback  :(
                add:OmitThisParameter<CommandHandler<META>["add"]>,
                group:OmitThisParameter<CommandHandler<META>["group"]>
            )=>void
    ):this{
        const fixGroupName = groupName.trim().split(/\s+/);
        this.nodeController.mkDirNode(fixGroupName);

        const add:OmitThisParameter<CommandHandler<META>["add"]> = 
            (
                name,
                handler
            ) => {
            const fixName = name.trim(); 

            this.nodeController.addNode([...fixGroupName,fixName], handler);
            return this;
        };
        const group:OmitThisParameter<CommandHandler<META>["group"]> = 
            (
                groupName,
                callback
            ) => {
            const fixName = groupName.trim(); 
            this.group([...fixGroupName,fixName].join(" "), callback);
            return this;
        };

        callback(add,group);
        return this;
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
    async run(input:string[]){

        const {cmd,args} = this.parserCmd(input);

        for(const i in cmd){
            if(this.nodeController.hasNode(cmd))break;

            const tmp = cmd.pop();

            if(tmp)args.unshift(tmp);
        }

        const data:Data<META> = {
            args,cmd,input,
            meta:this.commandMetaData
        }

        if(!cmd.length)cmd.push("");
        if(cmd[0] == null){return this.commandUndefined(data)};

        const node = this.nodeController.getNode(cmd);

        if(!(node?.data)){return this.commandUndefined(data)};

        (await node.data(data));
    }
}