import { IndexableType } from "dexie";
import { db } from "../database";

export interface DataType {
    id?: number
    label: string
}

const datatype = db.table('datatype');

export async function createNew(): Promise<IndexableType> {
    return datatype.add({ label: "new type" })
}

export async function getById(id: number): Promise<DataType> {
    return await datatype.get({ id })
}

export async function findDatatypes(label: string, limit: number): Promise<DataType[]> {

    if (label === "") {
        return await datatype.limit(limit).toArray()
    }

    return await datatype.where("label").startsWithIgnoreCase(label).limit(limit).toArray()
}


export async function updateDatatype(id: number, changes: any) {
    datatype.update(id, changes);
}