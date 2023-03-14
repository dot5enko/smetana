import { IndexableType } from "dexie";
import { Address, Program } from ".";
import { AddressHandler, DataTypeHandler, ProgramHandler, WatchedAddressHandler } from "../database";
import { DataTypeField, DataTypeFieldHandler, getFieldsForType, getFieldSize } from "./DataTypeField";
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

export type ItemFilter<T> = (item: T) => boolean

// todo add is_limited to response
export async function findDatatypes(label: string, limit: number, itemFilter?: ItemFilter<DataType>): Promise<DataType[]> {

    const datatype = DataTypeHandler.getTable();

    if (label === "") {
        return await datatype.limit(limit).toArray()
    }

    return await datatype.filter((it: DataType) => {

        // todo optimize
        const labelPassed = it.label.toLowerCase().indexOf(label.toLowerCase()) != -1;

        if (!labelPassed) {
            return false;
        } else {
            if (itemFilter) {
                return itemFilter(it)
            } else {
                return true;
            }
        }

    }).limit(limit).toArray()
}

export async function datatypesForDiscriminator(disc: Uint8Array): Promise<DataType[]> {

    const datatype = DataTypeHandler.getTable();

    return await datatype.
        where("discriminator").
        equals(disc).
        filter((it: DataType) => {
            return it.is_anchor;
        }).
        toArray()
}

export async function datatypesForProgram(program: string, label: string = "", limit: number): Promise<DataType[]> {

    const datatype = DataTypeHandler.getTable();

    console.log('fetching datatypes for program with query :', label, program)

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

export interface DataTypeSync {
    typ: DataType
    fields: DataTypeField[]
}

export async function getDataTypeForSync(typ: DataType): Promise<DataTypeSync> {

    const result: DataTypeSync = {
        typ: typ,
        fields: await getFieldsForType(typ.id as number)
    };

    return result;
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

export interface HasTypeResponse {
    typ?: DataTypeSync,
    fetched: boolean
}

// todo add discriminator bytes ?
export async function getTypeToDecode(address: Address, fetchidl: boolean, discriminator?: Uint8Array): Promise<HasTypeResponse> {

    const address_id = address.id as number;

    let result: HasTypeResponse = {
        fetched: fetchidl
    }

    if (discriminator) {

        const types = await datatypesForDiscriminator(discriminator);


        if (types.length > 0) {
            if (types.length > 1) {
                console.log('--- more than 1 datatype are found by discriminator, codec could be wrong, perform filtering by program owner first')
            }

            const syncedT = await getDataTypeForSync(types[0]);
            result.typ = syncedT;
            return result;
        }

    }


    const watchedAddr = await WatchedAddressHandler.getById(address_id);

    if (watchedAddr != null) {

        console.log('there is watched address there, type should be just fine to find')

        const typref = await DataTypeHandler.getById(watchedAddr.data_type_id)
        const syncedT = await getDataTypeForSync(typref);
        result.typ = syncedT;

        return result;
    }

    console.log(' --- no watched address were found : (')

    // todo fetch address if fetchidl = true
    if (address != null && address.program_owner != null) {

        console.log(' ---- address found:', address)

        const program: Program = await ProgramHandler.getTable().
            where('address_id').
            equals(address.program_owner).
            first()

        if (program != null) {

            console.log(' ----- program found:', program)

            const program_addr = await AddressHandler.getById(address.program_owner);

            const typeRef: DataType = await DataTypeHandler.getTable().
                where('program_id').
                equals(program_addr.address).
                // todo fix this
                filter((it: DataType) => {
                    console.log(it.info.size_bytes, ' == ', address.datalen)
                    return it.info.size_bytes == address.datalen;
                }).first()

            if (typeRef) {
                const syncedT = await getDataTypeForSync(typeRef);
                result.typ = syncedT;
            } else {
                console.log('unable to find a type to decode')
            }

        } else {
            // fetch idl if needed
        }
    } else {
        // force fetch addr
        console.log(" ### address not found :(", address)
    }

    return result;
}
