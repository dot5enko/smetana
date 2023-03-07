import { IndexableType } from "dexie";
import { db } from "../database";

export interface DataTypeAggregatedInfo {
    used_by: number,
    fields_count: number,
    size_bytes: number
}

export interface DataType {
    id?: number
    label: string
    protect_updates: boolean
    program_id: string

    info: DataTypeAggregatedInfo
}

const datatype = db.table('datatype');

export async function createNew(): Promise<IndexableType> {

    const rndName  = Math.random().toString(36).slice(2)

    const typ: DataType = {
        label: `type-${rndName}`,
        protect_updates: false,
        program_id: "",
        info: {
            used_by: 0,
            fields_count: 0,
            size_bytes: 0,
        }
    }

    return datatype.add(typ)
}

export async function getById(id: number): Promise<DataType> {
    return await datatype.get({ id })
}

export async function findDatatypes(label: string, limit: number): Promise<DataType[]> {

    if (label === "") {
        return await datatype.limit(limit).toArray()
    }

    return await datatype.filter((it: DataType) => {
        return it.label.toLowerCase().indexOf(label.toLowerCase()) != -1
    }).limit(limit).toArray()
}


export async function updateDatatype(id: number, changes: any) {
    datatype.update(id, changes);
}

export async function removeType(id: number) {
    return datatype.delete(id);
}
