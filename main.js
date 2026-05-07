import minimist from "minimist";

const args = minimist(process.argv.slice(2),{
    alias:{
        p:"port"
    },
    default:{
        port:3000
    },
    number:["port"]
});

console.log(args);