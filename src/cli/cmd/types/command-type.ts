export type CommandsTable<CommandsMap> = {
    [K in keyof CommandsMap]:(arg:CommandsMap[K]) => void;
};