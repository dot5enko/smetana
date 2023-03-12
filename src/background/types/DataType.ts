import { IndexableType } from "dexie";
import { DataTypeHandler } from "../database";
import { DataTypeFieldHandler, getFieldSize } from "./DataTypeField";
import { DecodedField } from "./DecodedField";
import { ParsedTypeFromIdl } from "./ParsedTypeFromIdl";

export interface DataType {
    id?: number
    label: string
    protect_updates: boolean
    program_id: string

    info: DataTypeAggregatedInfo
    discriminator: Uint8Array
    is_anchor: boolean
}

export interface DataTypeAggregatedInfo {
    used_by: number,
    fields_count: number,
    size_bytes: number
}

export async function createNew(is_anchor: boolean): Promise<IndexableType> {

    const table = DataTypeHandler.getTable();

    const rndName = Math.random().toString(36).slice(2)

    const typ: DataType = {
        label: `type-${rndName}`,
        protect_updates: false,
        program_id: "",
        info: {
            used_by: 0,
            fields_count: 0,
            size_bytes: 0,
        },
        is_anchor,
        discriminator: new Uint8Array(8)
    }

    return table.add(typ)
}

export async function findDatatypes(label: string, limit: number): Promise<DataType[]> {

    const datatype = DataTypeHandler.getTable();

    if (label === "") {
        return await datatype.limit(limit).toArray()
    }

    return await datatype.filter((it: DataType) => {
        return it.label.toLowerCase().indexOf(label.toLowerCase()) != -1
    }).limit(limit).toArray()
}

export async function datatypesForDiscriminator(disc: Uint8Array): Promise<DataType[]> {

    const datatype = DataTypeHandler.getTable();

    return await datatype.
        where("discriminator").
        equals(disc).
        toArray()
}

export async function datatypesForProgram(program: string, label: string = "", limit: number): Promise<DataType[]> {

    const datatype = DataTypeHandler.getTable();

    console.log('fetching datatypes with query :', label)

    if (label === "") {

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

export async function importType(program_id: string, t: ParsedTypeFromIdl): Promise<number> {

    const datatype = DataTypeHandler.getTable();

    const typ: DataType = {
        label: t.name,
        protect_updates: true,
        program_id: program_id,
        info: t.info,
        is_anchor: !t.struct,
        discriminator: t.discriminator
    }

    const typeid = (await datatype.add(typ)) as number

    let max_order_position = 0;

    for (var fieldit of t.fields) {

        fieldit.datatype_id = typeid;

        await DataTypeFieldHandler.getTable().add(fieldit)

        typ.info.fields_count += 1;
        typ.info.size_bytes += await getFieldSize(fieldit);

        datatype.update(typeid, typ)

        max_order_position += 1
    }

    return Promise.resolve(typeid);
}

