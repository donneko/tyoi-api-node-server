import minimist from "minimist"

export function getOption(argv:string[]){
    // コマンド解析
    const args = minimist(argv,{
        alias: {
            p: "port",
            o: "open",
            v: "version",
            h: "help",
        },

        boolean: [
            "open",
            "version",
            "help"
        ],

        string: [
            "template"
        ]
    });

    const {open:openBrowser,...tmp} = args;
    const updateArgs = args.open?{openBrowser,...tmp}:args;

    return updateArgs
}
