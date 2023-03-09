import { IndexableType } from "dexie";
import { db } from "../database";
import { getById } from "./DataType";

export interface DataTypeField {
    id?: number
    datatype_id: number
    order_position: number
    optional: boolean
    label: string

    field_type: string
    is_complex_type: boolean

    is_array: boolean
    array_size: number
    is_dynamic_size: boolean

    hide: boolean
}

const datatypefield = db.table('datatypefield');
const datatype = db.table('datatype');

export async function getFieldSize(object: DataTypeField) {
    if (object.is_complex_type) {

        // fetch type by id

        throw new Error('complex field types not implemented. can\'t calc size of field')
    } else {

        let size = object.optional ? 1 : 0;

        let arraySizeModified = object.is_array ? object.array_size : 1;

        let elementSize = 0

        switch (object.field_type) {

            case "u8":
            case "i8":
            case "bool":

                elementSize = 1;
                break;
            case "u16":
            case "i16":
                elementSize = 2;
                break;
            case "u32":
            case "i32":
                elementSize = 4;
                break;
            case "u64":
            case "i64":
                elementSize = 8;
                break;
            case "u128":
            case "i128":
                elementSize = 16;
                break;
            case "publicKey":
                elementSize = 32;
                break;
            default:
                throw new Error(`unsupported field type: ${object.field_type}`)
        }

        if (!object.is_dynamic_size) {
            size += arraySizeModified * elementSize;
        } else {
            // 4 bytes for data length
            // + data length itself. 
            // data size should be marked as dynamic
            size += 4;
        }
        return Promise.resolve(size);
    }
}

export async function createNewField(parent_type: number): Promise<IndexableType> {

    const typeObject = await getById(parent_type);
    const fields = await getFieldsForType(parent_type);

    let max_order_position = 0;
    if (fields.length > 0) {
        max_order_position = fields[fields.length - 1].order_position;
    }

    const fieldObject: DataTypeField = {
        datatype_id: parent_type,
        order_position: max_order_position + 1,
        label: "",
        optional: false,
        field_type: 'u8', // byte,
        is_complex_type: false,
        hide: false,
        is_array: false,
        array_size: 1,
        is_dynamic_size: false
    }
    const result = await datatypefield.add(fieldObject)

    typeObject.info.fields_count += 1;

    typeObject.info.size_bytes += await getFieldSize(fieldObject);
    datatype.update(typeObject.id, typeObject)

    return result;
}

export async function getFieldsForType(parent_type: number): Promise<DataTypeField[]> {

    return datatypefield
        .where("datatype_id")
        .equals(parent_type)
        .sortBy("order_position");

}

// todo fix typo
export async function getFieldsById(id: number): Promise<DataTypeField> {
    return datatypefield.get({ id });
}

// todo add try catch
export async function updateDatatypeField(id: number, changes: any) {

    // detect type changes
    const fieldObject = await getFieldsById(id);

    if (fieldObject.field_type != changes.field_type) {
        // type changed
        const typeObject = await getById(fieldObject.datatype_id);

        typeObject.info.size_bytes -= await getFieldSize(fieldObject);
        typeObject.info.size_bytes += await getFieldSize(changes)

        await datatype.update(typeObject.id, typeObject)
    }

    return datatypefield.update(id, changes);
}

export async function removeTypeField(id: number) {

    const fieldObject = await getFieldsById(id);
    const typeObject = await getById(fieldObject.datatype_id);

    typeObject.info.fields_count -= 1;

    typeObject.info.size_bytes -= await getFieldSize(fieldObject);
    await datatype.update(typeObject.id, typeObject)

    return datatypefield.delete(id);
}


export async function moveUp(id: number) {
    const val: DataTypeField = await datatypefield.get(id);

    if (val.order_position != 0) {

        const prev: DataTypeField = await datatypefield.get({ order_position: val.order_position - 1 })

        // move down prev
        await datatypefield.update(prev.id, {
            order_position: val.order_position
        })

        return datatypefield.update(id, {
            order_position: val.order_position - 1
        })
    }

    return Promise.reject('cant move up top element')
}

export async function moveDown(id: number) {
    const val: DataTypeField = await datatypefield.get(id);

    const next: DataTypeField = await datatypefield.get({ order_position: val.order_position + 1 })

    if (next === undefined) {
        return Promise.reject('cant move down last element')
    }

    // move up next
    await datatypefield.update(next.id, {
        order_position: val.order_position
    })

    return datatypefield.update(id, {
        order_position: val.order_position + 1
    })


}