import { IndexableType } from "dexie";
import { db } from "../database";

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

export async function createNewField(parent_type: number): Promise<IndexableType> {

    const fields = await getFieldsForType(parent_type);

    let max_order_position = 0;
    if (fields.length > 0) {
        max_order_position = fields[fields.length - 1].order_position;
    }

    return datatypefield.add({ datatype_id: parent_type, order_position: max_order_position + 1, label: "new field" })
}

export async function getFieldsForType(parent_type: number): Promise<DataTypeField[]> {

    return datatypefield
        .where("datatype_id")
        .equals(parent_type)
        .sortBy("order_position");

}

export async function getFieldsById(id: number): Promise<DataTypeField> {
    return datatypefield.get({ id });
}

export async function updateDatatypeField(id: number, changes: any) {
    datatypefield.update(id, changes);
}

