


export class ServicesRegister<ServicesMAP extends Record<string,unknown>> {
    constructor(private services: ServicesMAP){}

    get<K extends keyof ServicesMAP>(key: K):ServicesMAP[K] {
        return this.services[key];
    }
}