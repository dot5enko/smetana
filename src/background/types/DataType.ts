import { IndexableType } from "dexie";
import { db } from "../database";
import { DataTypeField, getFieldsForType, getFieldSize } from "./DataTypeField";
import { DecodedField, decodeSimpleType } from "./DecodedField";

export interface ParsedTypeFromIdl {
    fields: DataTypeField[]
    info: DataTypeAggregatedInfo
    complex: boolean
    name: string
    struct: boolean
}

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
const datatypefield = db.table('datatypefield');

export async function createNew(): Promise<IndexableType> {

    const rndName = Math.random().toString(36).slice(2)

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

export async function datatypesForProgram(program: string, label: string = "", limit: number): Promise<DataType[]> {

    console.log('fetching datatypes with query :', label)

    if (label === "") {

        console.log(`filter types by program id "${program}"`)

        const result = await datatype.
            where("program_id").
            equals(program).
            limit(limit).
            toArray()

        console.log(' -- filtered out ', result.length, ' items')

        return result;
    }

    return await datatype.
        where("program_id").
        equals(program).
        filter((it: DataType) => {
            return it.label.toLowerCase().indexOf(label.toLowerCase()) != -1
        }).limit(limit).toArray()
}

export interface DecodeTypeResult {
    partial: boolean
    fields: DecodedField[]
}

export async function decodeType(data: Uint8Array, typ: DataType): Promise<DecodeTypeResult> {

    let result: DecodedField[] = [];

    const fields = await getFieldsForType(typ.id as number);

    let offset = 0;
    let err = false;

    for (var itfield of fields) {
        if (itfield.is_complex_type) {
            throw new Error('complex types not implemented yet');
        } else {
            const decoderesult = decodeSimpleType(data.slice(offset), itfield);
            if (decoderesult.error) {
                console.log(`error decoding simple field "${itfield.label}": ${decoderesult.error}`)
                err = true;
                break;
            } else {
                result.push({
                    field: itfield,
                    decoded_value: decoderesult.outvalue,
                    present: decoderesult.contains
                })

                offset += decoderesult.bytesUsed
            }
        }
    }

    if (offset != data.length) {
        err = true;
    }

    return { partial: err, fields: result };
}

export async function importType(t: ParsedTypeFromIdl): Promise<number> {

    const typ: DataType = {
        label: t.name,
        protect_updates: false,
        program_id: "",
        info: {
            used_by: 0,
            fields_count: 0,
            size_bytes: 0,
        }
    }

    const typeid = (await datatype.add(typ)) as number

    let max_order_position = 0;

    for (var fieldit of t.fields) {

        fieldit.datatype_id = typeid;

        await datatypefield.add(fieldit)

        typ.info.fields_count += 1;
        typ.info.size_bytes += await getFieldSize(fieldit);

        datatype.update(typeid, typ)

        max_order_position += 1
    }

    return Promise.resolve(typeid);
}

