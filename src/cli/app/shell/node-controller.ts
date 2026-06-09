
export type Node<D extends unknown> = {
    name:string;
    data?:D;
    children: Map<string, Node<D>>;
};

export class NodeController<DATA extends unknown = unknown>{
    private node = new Map<string, Node<DATA>>();


    getAllNode():Map<string, Node<DATA>>{
        return this.node
    }

    private createNodeObject(name:string):Node<DATA>{
        const obj = {
            name,
            children: new Map()
        }

        return structuredClone(obj);
    }

    private getNodeRecursion(nodePath:string[],nodeData:Map<string, Node<DATA>>):Node<DATA>{
        const [name,...nextPath] = nodePath;
        if(name == null) throw Error(`Node path is undefined`);

        const node = nodeData.get(name);

        if(!node) throw Error(`${nodePath.join("/")} as node is undefined`);

        if(!nextPath[0]) return node;
        return this.getNodeRecursion(nextPath,node.children);
    }

    getNode(nodePath:string[]):Node<DATA>{

        return this.getNodeRecursion(
            nodePath,
            this.node
        );
    }

    hasNode(nodePath:string[]):boolean{
        try {
            this.getNodeRecursion(
                nodePath,
                this.node
            );
            return true;
        } catch {
            return false;
        }
    }

    private mkDirNodeRecursion(nodePath:string[],nodeData:Map<string, Node<DATA>>){
        const [name,...nextPath] = nodePath;

        if(name == null) return;

        const node = nodeData.get(name);

        if(node){
            this.mkDirNodeRecursion(nextPath,node.children);
        }else{
            const obj = this.createNodeObject(name);
            nodeData.set(name,obj);
            this.mkDirNodeRecursion(nodePath,nodeData);
        }
    }

    mkDirNode(nodePath:string[]){
        this.mkDirNodeRecursion(
            nodePath,
            this.node
        );
    }


    addNode(nodePath:string[],data:DATA){

        if(!this.hasNode(nodePath)) this.mkDirNode(nodePath);

        const node = this.getNode(nodePath);
        node.data = data;
    }
}