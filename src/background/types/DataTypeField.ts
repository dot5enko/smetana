import { IndexableType } from "dexie";
import { db } from "../database";
import { getById } from "./DataType";
import borsh from "borsh"
import { DecodeFieldResult } from "./DecodedField";

export interface DataTypeField {
    id?: number
    datatype_id: number
    order_position: number
    optional: boolean
    label: string

    field_type: string
    is_complex_type: boolean

}

const datatypefield = db.table('datatypefield');
const datatype = db.table('datatype');


export async function getFieldSize(object: DataTypeField) {
    if (object.is_complex_type) {
        throw new Error('complex field types not implemented. can\'t calc size of field')
    } else {

        let size = object.optional ? 1 : 0;

        switch (object.field_type) {
            case "u8":
            case "i8":
            case "string":
            case "bool":

                if (object.field_type === "string") {
                    console.log("string size cant be determined beforehand, force 1 byte")
                }

                size += 1;
                break;
            case "u16":
            case "i16":
                size += 2;
                break;
            case "u32":
            case "i32":
                size += 4;
                break;
            case "u64":
            case "i64":
                size += 8;
                break;
            case "u128":
            case "i128":
                size += 16;
                break;
            case "publicKey":
                size += 32;
                break;
            default:
                console.error(`unsupported field type: ${object.field_type}`)
                return Promise.resolve(0)
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
        field_type: '',
        is_complex_type: false
    }
    const result = datatypefield.add(fieldObject)

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