import { initSubServiceCa } from "../command/ca.js";
import { initSubServiceConsole } from "../command/console.js";

export const moduleRegistryList = [
    initSubServiceCa(),
    initSubServiceConsole(),
] as const;

type UnionToIntersection<U> =
    (U extends unknown ? (arg: U) => void : never) extends
    (arg: infer I) => void
        ? I
        : never;

type CommandArgMap<CommandTable> =
    CommandTable extends Record<string, (...args: any[]) => any>
        ? { [K in keyof CommandTable]: Parameters<CommandTable[K]>[0] }
        : never;

export type ModuleRegistryList = typeof moduleRegistryList;
export type ModuleRegistryItem = ModuleRegistryList[number];

export type ModuleCommands = UnionToIntersection<
    CommandArgMap<ModuleRegistryItem["command"]>
>;

export type ModuleRegistryTree = {
    [Item in ModuleRegistryItem as Item["namespace"]]: Item
};
