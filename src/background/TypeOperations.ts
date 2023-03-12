import { IndexableType, Table } from "dexie";

export class TypeOperations<T> {

    private table: Table<any, IndexableType>;

    constructor(dbtable: Table<any, IndexableType>) {
        this.table = dbtable;
    }

    async getById(id: number): Promise<T> {
        return this.table.get({ id: id });
    }

    async update(id: number, values: any) {
        return this.table.update(id, values);
    }

    getTable(): Table<any, IndexableType> {
        return this.table;
    }
}