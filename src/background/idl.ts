import { ParsedTypeFromIdl } from "./types/DataType";
import { DataTypeField, getFieldSize } from "./types/DataTypeField"

export async function parseIdlTypes(idl: any, includeComplex: boolean) { //: Promise<DataType[]> {

    let types = new Map<string, ParsedTypeFromIdl>();

    for (var it of idl.types) {

        const parseResult = await parseIdlStruct(it);
        if (includeComplex || !parseResult.complex) {
            parseResult.name = it.name;
            parseResult.struct = true
            types.set(it.name, parseResult)
        }
    }

    for (var it of idl.accounts) {
        const parseResult = await parseIdlStruct(it);
        if (includeComplex || !parseResult.complex) {
            parseResult.name = it.name;
            types.set(it.name, parseResult)
        }
    }

    return types;
}

async function parseIdlStruct(struct: any): Promise<ParsedTypeFromIdl> {

    let result: DataTypeField[] = [];

    let idx = 0;

    let noComplex = true;

    let size = 0;

    for (var it of struct.type.fields) {

        const complexType = (typeof it.type !== 'string')

        let type = "";

        if (complexType) {

            console.log(` -- skip complex type ${JSON.parse(it.type)}`)

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
                is_complex_type: false,
                hide: false,
                is_array: false,
                array_size: 1
            };

            size += await getFieldSize(fieldObj);

            result.push(fieldObj);
        }
        idx += 1
    }

    return Promise.resolve({
        name: "",
        fields: result,
        complex: !noComplex,
        info: {
            fields_count: result.length,
            size_bytes: size,
            used_by: 0,
        },
        struct: false
    });


}