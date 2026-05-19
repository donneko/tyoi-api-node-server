export type EventBusHandler<Type, Result = unknown> =
    (arg: Type) => Result | Promise<Result>;
export class EventBus<EventBusMap extends Record<string,unknown>>{

    #EVENT_DATA_STORE = new Map<
    keyof EventBusMap,
    Function[]
    >();

    /**
     * ハンドラを登録する関数
     * @param type 登録するキー名
     * @param fn 実行する関数処理
     * @returns handler を解除するための関数
     * @example
     * const unsubscribe = eventBus.on("foo", handler);
     * unsubscribe(); // handler を解除
     */
    on<Key extends keyof EventBusMap>(type:Key,fn:EventBusHandler<EventBusMap[Key]>){
        if(!this.#EVENT_DATA_STORE.has(type)){
            this.#EVENT_DATA_STORE.set(type,[]);
        }
        const list = this.#EVENT_DATA_STORE.get(type)!;

        list.push(fn);

        return () => this.off(type,fn);
    }

    /**
     * ハンドラを登録する関数して、一度のみ実行する
     * @param type 登録するキー名
     * @param fn 実行する関数処理
     * @example
     * eventBus.once("foo", handler);
     */
    once<Key extends keyof EventBusMap>(type:Key,fn:EventBusHandler<EventBusMap[Key]>){
        const func:EventBusHandler<EventBusMap[Key]> = (arg) =>{
            this.off(type,func);
            return fn(arg);
        };
        return this.on(type,func);
    }

    /**
     * ハンドラがストアに存在するかを検証する
     * @param type 調べるキー名
     * @returns 存在するならtrue
     * @example
     * console.log(eventBus.has("foo"));
     */
    has(type: string): type is Extract<keyof EventBusMap, string> {
        return this.#EVENT_DATA_STORE.has(
            type as Extract<keyof EventBusMap, string>
        );
    }

    /**
     * ハンドラの登録を解除する
     * @param type 解除するするキー名
     * @example
     * eventBus.off("foo",handler);
     */
    off<Key extends keyof EventBusMap>(type:Key,fn:EventBusHandler<EventBusMap[Key]>){
        const list = this.#EVENT_DATA_STORE.get(type);
        if (!list) return;

        const index = list.indexOf(fn);
        if (index === -1) return;

        list.splice(index,1);

        if(list.length === 0){
            this.#EVENT_DATA_STORE.delete(type);
        }
    }

    /**
     * キー名で登録されたハンドラを実行する
     * @param type 解除するするキー名
     * @param arg ハンドラにわたす引数
     * @example
     * eventBus.emit("foo",arg);
     */
    async emit<Key extends keyof EventBusMap>(type:Key,arg:EventBusMap[Key]):Promise<unknown>{
        const list = this.#EVENT_DATA_STORE.get(type);

        if(!list)return;

        for(const fn of [...list]){
            try {
                return await (
                    fn as EventBusHandler<EventBusMap[Key]>
                )(arg);
            } catch (error) {
                console.error(`[EventBus emit error] ${String(type)}`, error);
                throw error;
            }
        }
    }
}
