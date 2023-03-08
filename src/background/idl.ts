import { ParsedTypeFromIdl } from "./types/DataType";
import { DataTypeField, getFieldSize } from "./types/DataTypeField"

export async function parseIdlTypes(idl: any, includeComplex: boolean) { //: Promise<DataType[]> {

    let types = new Map<string, ParsedTypeFromIdl>();

    for (var it of idl.types) {

        const parseResult = await parseIdlStruct(it, types);
        if (includeComplex || !parseResult.complex) {
            parseResult.name = it.name;
            parseResult.struct = true
            types.set(it.name, parseResult)
        }
    }

    for (var it of idl.accounts) {
        const parseResult = await parseIdlStruct(it, types);
        if (includeComplex || !parseResult.complex) {
            parseResult.name = it.name;
            types.set(it.name, parseResult)
        }
    }

    return types;
}

async function parseIdlStruct(struct: any, typesMap: Map<string, ParsedTypeFromIdl>): Promise<ParsedTypeFromIdl> {

    let result: DataTypeField[] = [];

    // discriminator offset
    let idx = 1;
    let size = 8;

    let noComplex = true;

    let discriminatorField: DataTypeField = {
        datatype_id: 0,
        order_position: 0,
        optional: false,
        label: "discriminator",
        field_type: "u64",
        is_complex_type: false,
        is_array: false,
        array_size: 1,
        hide: true
    };
    result.push(discriminatorField)

    for (var it of struct.type.fields) {

        const complexType = (typeof it.type !== 'string')

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

        if (complexType) {
            // workaroud for complex anchor type early support
            // replaces complex type size with byte array :)

            console.log('type is ', it.type)

            fieldObj.is_array = true;
            fieldObj.field_type = 'u8';

            // arrays 
            if ('array' in it.type) {

                let arraySize = it.type.array[1]
                let arrayElementTypeComplex = typeof it.type.array[0] != "string";

                fieldObj.array_size = arraySize;

                if (!arrayElementTypeComplex) {
                    fieldObj.field_type = it.type.array[0];
                } else {

                    if ('array' in it.type.array[0]) {
                        console.log('found too nested array. not supported right now')

                        noComplex = false;
                    } else {

                        let referencedTypeName = it.type.array[0].defined;

                        const parsedData = typesMap.get(referencedTypeName)
                        if (parsedData) {
                            console.log('%found referenced type ', referencedTypeName, parsedData)


                            // replace struct with byte array
                            fieldObj.field_type = 'u8';
                            fieldObj.array_size = parsedData.info.size_bytes

                        } else {
                            console.log('%not found type ', referencedTypeName)
                            noComplex = false;
                        }
                    }

                }
            } else {
                if ('defined' in it.type) {
                    // struct reference
                    // noComplex = false;

                    let referencedTypeName = it.type.defined

                    const parsedData = typesMap.get(referencedTypeName)
                    if (parsedData) {
                        console.log('found referenced type ', referencedTypeName, parsedData)

                        fieldObj.field_type = 'u8';
                        fieldObj.array_size = parsedData.info.size_bytes
                        
                    } else {
                        console.log('not found type ', referencedTypeName)
                        noComplex = false;
                    }
                }
            }
        }

        size += await getFieldSize(fieldObj);

        result.push(fieldObj);

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