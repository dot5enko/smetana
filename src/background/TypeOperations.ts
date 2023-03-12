import { IndexableType, Table } from "dexie";


export class TypeOperations<T> {

    private table: Table<any, IndexableType>;


    protected async beforeUpdate(self: T, val: any): Promise<boolean> {
        return true;
    }

    protected async beforeRemove(self: T): Promise<boolean> {
        return true;
    }

    constructor(dbtable: Table<any, IndexableType>) {
        this.table = dbtable;
    }

    async getById(id: number): Promise<T> {
        return this.table.get({ id: id });
    }

    async update(id: number, values: any) {

        const it = await this.getById(id)

        const cont = await this.beforeUpdate(it, values);
        if (!cont) {
            return Promise.reject(false);
        }

        return this.table.update(id, values);
    }
    async remove(id: number) {

        const it = await this.getById(id)

        const cont = await this.beforeRemove(it);

        if (!cont) {
            return Promise.reject(false);
        }
        return this.table.delete(id);
    }

    getTable(): Table<any, IndexableType> {
        return this.table;
    }

}