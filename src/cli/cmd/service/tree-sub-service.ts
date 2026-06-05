import { ModuleRegistryList , ModuleRegistryTree } from "../data/command-index.js";

export function treeSubService(moduleRegistryList:ModuleRegistryList): ModuleRegistryTree {
    return Object.fromEntries(
        moduleRegistryList.map((moduleRegistry) => [moduleRegistry.namespace, moduleRegistry]),
    ) as ModuleRegistryTree;
}
