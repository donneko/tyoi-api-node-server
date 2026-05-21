type CodeTableRecord = {
    code: number;
    label: string;
    [key: string]: unknown;
};

type CodeByLabel<
    T extends CodeTableRecord,
    L extends T["label"]
> = Extract<T, { label: L }>["code"];

type MetaByLabelAndCode<
    T extends CodeTableRecord,
    L extends T["label"],
    C extends CodeByLabel<T, L>
> = Extract<T, { label: L; code: C }>;

export class CodeToMetaManager<CodeTable extends CodeTableRecord> {
    private CODE_TABLE: readonly CodeTable[];

    constructor(dataTable: readonly CodeTable[]) {
        this.CODE_TABLE = dataTable;
    }

    push(record: CodeTable): void {
        this.CODE_TABLE = [...this.CODE_TABLE, record];
    }

    getMeta<
        L extends CodeTable["label"],
        C extends CodeByLabel<CodeTable, L>
    >(
        label: L,
        code: C,
    ): MetaByLabelAndCode<CodeTable, L, C> {
        const record = this.CODE_TABLE.find(
        (item): item is MetaByLabelAndCode<CodeTable, L, C> =>
            item.label === label && item.code === code
        );

        if (!record) {
            throw new Error(`Unknown error mapping: label=${label}, code=${code}`);
        }

        return record;
    }
}