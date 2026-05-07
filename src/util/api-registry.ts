export type ApiRegistryHandler<Type> = (arg:Type) => void;
export class ApiRegistry<ApiRegistryMap extends Record<string,unknown>>{

    #EVENT_DATA_STORE = new Map<
    keyof ApiRegistryMap,
    Function
    >();

    /**
     * ハンドラを登録する関数
     * @param type 登録するキー名
     * @param fn 実行する関数処理
     * @returns handler を解除するための関数
     * @example
     * const unsubscribe = registry.on("foo", handler);
     * unsubscribe(); // handler を解除
     */
    on<Key extends keyof ApiRegistryMap>(type:Key,fn:ApiRegistryHandler<ApiRegistryMap[Key]>){
        if(this.#EVENT_DATA_STORE.has(type)){
            console.warn(`[EventBus on warn] すでに登録された関数が上書きされました。`);
        }

        this.#EVENT_DATA_STORE.set(type,fn)!;

        return () => this.off(type);
    }

    /**
     * ハンドラを登録する関数して、一度のみ実行する
     * @param type 登録するキー名
     * @param fn 実行する関数処理
     * @example
     * registry.once("foo", handler);
     */
    once<Key extends keyof ApiRegistryMap>(type:Key,fn:ApiRegistryHandler<ApiRegistryMap[Key]>){
        const func:ApiRegistryHandler<ApiRegistryMap[Key]> = (arg) =>{
            this.off(type);
            fn(arg);
        };
        this.on(type,func);
    }

    /**
     * ハンドラがストアに存在するかを検証する
     * @param type 調べるキー名
     * @returns 存在するならtrue
     * @example
     * console.log(registry.has("foo"));
     */
    has(type: string): type is Extract<keyof ApiRegistryMap, string> {
        return this.#EVENT_DATA_STORE.has(type);
    }

    /**
     * ハンドラの登録を解除する
     * @param type 解除するするキー名
     * @example
     * registry.off("foo",handler);
     */
    off<Key extends keyof ApiRegistryMap>(type:Key){
        this.#EVENT_DATA_STORE.delete(type);
    }

    /**
     * キー名で登録されたハンドラを実行する
     * @param type 解除するするキー名
     * @param arg ハンドラにわたす引数
     * @example
     * registry.emit("foo",arg);
     */
    emit<Key extends keyof ApiRegistryMap>(type:Key,arg:ApiRegistryMap[Key]){
        const fn = this.#EVENT_DATA_STORE.get(type);

        if(!fn)return;

        try {
            return (fn as ApiRegistryHandler<ApiRegistryMap[Key]>)(arg);
        } catch (error) {
            console.error(`[EventBus emit error] ${String(type)}`, error);
        }
    }
}