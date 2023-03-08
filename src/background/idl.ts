import { DataTypeAggregatedInfo } from "./types/DataType";
import { DataTypeField, getFieldSize } from "./types/DataTypeField"

export async function parseIdlTypes(idl: any, includeComplex: boolean) { //: Promise<DataType[]> {

    let types = new Map<string, DataTypeField[]>();

    for (var it of idl.types) {

        const parseResult = await parseIdlStruct(it);
        if (!includeComplex || !parseResult.complex) {
            types.set(it.name, parseResult.fields)
        }
    }

    for (var it of idl.accounts) {
        const parseResult = await parseIdlStruct(it);
        if (!includeComplex || !parseResult.complex) {
            types.set(it.name, parseResult.fields)
        }
    }

    return types;
}

interface ParseIdlStructResult {
    fields: DataTypeField[]
    info: DataTypeAggregatedInfo
    complex: boolean
}
async function parseIdlStruct(struct: any): Promise<ParseIdlStructResult> {

    let result: DataTypeField[] = [];

    let idx = 0;

    let noComplex = true;

    let size = 0;

    for (var it of struct.type.fields) {

        const complexType = (typeof it.type !== 'string')

        let type = "";

        if (complexType) {
            // console.log(` -- skip complex type ${JSON.parse(it.type)}`)

            // type = "u8;"+

            // fill with u8 array ?

            noComplex = false;
        } else {
            let fieldObj: DataTypeField = {
                datatype_id: 0, // reference
                order_position: idx,
                optional: false,
                label: it.name,
                field_type: it.type,
                is_complex_type: false
            };

            size += await getFieldSize(fieldObj);

            result.push(fieldObj);
        }
        idx += 1
    }



    if (noComplex) {
        console.log(`found not complex type: --${struct.name}`);
    }

    return Promise.resolve({
        fields: result, complex: !noComplex, info: {
            fields_count: result.length,
            size_bytes: size,
            used_by: 0,
        }
    });


}