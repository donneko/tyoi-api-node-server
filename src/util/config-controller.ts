export class ConfigController<ConfigMap extends Record<string,unknown>>{

    private configData:ConfigMap;

    constructor(config:ConfigMap){
        this.configData = config;
    }

    updateConfig(config:Partial<ConfigMap>):void{
        const newConfig = {...config,...this.configData};
        this.configData = newConfig;
    }
    getConfig<K extends keyof ConfigMap>(key:K):ConfigMap[K]{
        return this.configData[key];
    }
}