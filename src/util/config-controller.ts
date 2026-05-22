import z from "zod";

export class ConfigController<ConfigMap extends Record<string,unknown>>{

    private configData:ConfigMap;
    private schema?: z.ZodType<ConfigMap>;

    constructor(config:ConfigMap, schema?: z.ZodType<ConfigMap>){
        this.configData = schema ? schema.parse(config) : config;
        if(schema)this.schema = schema;
    }

    updateConfig(config:Partial<ConfigMap>):void{
        const newConfig = { ...this.configData, ...config };
        this.configData = this.schema ? this.schema.parse(newConfig) : newConfig;
    }
    getConfig<K extends keyof ConfigMap>(key:K):ConfigMap[K]{
        return this.configData[key];
    }
    setSchema(schema:z.ZodType<ConfigMap>):void{
        this.schema = schema;
        this.configData = this.schema.parse(this.configData);
    }
}