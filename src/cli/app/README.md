# commandRunHandler

## flow

```
input => cmdHandler.run;

cmds => cmdHandler.add;

cmdHandler.run => minimal => run;

data => run;

```

## data

```
type data<META> = {
    meta :META;
    args :string[];
    cmd  :string[];
    input:string[];
};

data.meta = {
    pack:{
        version:"",
        name:""
    },
    cli:{
        cwd:"",
        ...
    }
};
```

## flow cmd add

```

cmds => cmdHandler.add;

input => cmdHandler.run => minimal => run;

```

## usage example cmd add and group method

```

cmdHandler.add("help",(data)=>command(data));

cmdHandler.add("info",(data)=>command(data));
cmdHandler.group("info",(add,group)=>{
    add("version",(data)=>command(data));
    add("status",(data)=>command(data));
    add("unlock",(data)=>command(data));

    group("dev",(add,group)=>{
        add("version",(data)=>command(data));
        add("status",(data)=>command(data));
        add("unlock",(data)=>command(data));
    });
});

```


## others

```
input => toLowCase;
cmdName => toLowCase;

```


## memo

```

CommandNode = {
    name: string;
    handler?: ()=>void;
    children: Map<string, {
        name: string;
        handler?: ()=>void;
        children: Map<string, CommandNode>;
    }>;
};

```