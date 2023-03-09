import { BinaryReader } from "borsh";
import { sha256 } from "js-sha256";
import { inflate } from "pako";
import { ParsedTypeFromIdl } from "./types/DataType";
import { DataTypeField, getFieldSize } from "./types/DataTypeField"
import { Buffer } from "buffer";
import { PublicKey } from "@solana/web3.js";


export interface FailedType {
    name: string
    cause: any
}

export interface ParseIdlResult {
    types: Map<string, ParsedTypeFromIdl>
    failed: FailedType[]
}

export async function parseIdlTypes(idl: any, includeComplex: boolean) {

    let failed = [];
    let types = new Map<string, ParsedTypeFromIdl>();

    for (var it of idl.types) {
        try {
            const parseResult = await parseIdlStruct(true,it, types);
            if (includeComplex || !parseResult.complex) {
                parseResult.name = it.name;
                parseResult.discriminator = new Uint8Array(calcDiscriminator(it.name))
                types.set(it.name, parseResult)
            }
        } catch (e: any) {
            failed.push({
                name: it.name,
                cause: e
            })
            console.error(`unable to parse type: ${it.name}: `, e)
        }
    }

    for (var it of idl.accounts) {
        try {
            const parseResult = await parseIdlStruct(false,it, types);
            if (includeComplex || !parseResult.complex) {
                parseResult.name = it.name;
                parseResult.discriminator = new Uint8Array(calcDiscriminator(it.name))
                types.set(it.name, parseResult)
            }
        } catch (e: any) {
            failed.push({
                name: it.name,
                cause: e
            })
            console.error(`unable to parse type: ${it.name}: `, e)
        }
    }

    return { types, failed };
}

async function parseIdlStruct(isType: boolean, struct: any, typesMap: Map<string, ParsedTypeFromIdl>): Promise<ParsedTypeFromIdl> {

    try {
        let result: DataTypeField[] = [];

        // discriminator offset
        let idx = isType ? 0 : 1;
        let size = isType ? 0 : 8;

        let noComplex = true;

        if (!isType) {
            let discriminatorField: DataTypeField = {
                datatype_id: 0,
                order_position: 0,
                optional: false,
                label: "discriminator",
                field_type: "u64",
                is_complex_type: false,
                is_array: false,
                array_size: 1,
                hide: true,
                is_dynamic_size: false
            };

            result.push(discriminatorField)
        }

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
                array_size: 1,
                is_dynamic_size: false
            };

            if (complexType) {
                // workaroud for complex anchor type early support
                // replaces complex type size with byte array :)

                // console.log('type is ', it.type)

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
                            // console.log('found referenced type ', referencedTypeName, parsedData)

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
            struct: isType,
            discriminator: new Uint8Array(8),
            is_anchor: !isType
        });
    } catch (e: any) {
        throw new Error('unable to parse json idl: ' + e.message, { cause: e })
    }
}

export function calcDiscriminator(typename: string) {

    let val = `account:${typename}`
    let hash = sha256.array(val).slice(0, 8);

    return hash;
}

// returns idl json
export function parseIdlFromAccountData(accountdata: Uint8Array) {

    try {
        let lenOffset = 0;

        let buf = Buffer.from(accountdata.slice(lenOffset))
        const reader = new BinaryReader(buf);

        const discriminator = reader.readU64();
        const authority = new PublicKey(reader.readFixedArray(32));

        console.log(`authority and discriminator : ${discriminator.toString()} : ${authority.toBase58()}`)

        // read data size
        const datalen = reader.readU32()

        if (datalen > 100000) {
            throw new Error('error decoding idl account. size should be less than 100k at least')
        } else {
            try {
                const data = reader.readFixedArray(datalen);

                const inflatedIdl = inflate(data);
                const parsedIdl = JSON.parse(new TextDecoder().decode(inflatedIdl));

                return parsedIdl;
            } catch (e) {
                throw new Error('unable to parse idl', {
                    cause: e
                })
            }
        }
    } catch (e: any) {
        throw new Error("unable to get idl data out of idl account", {
            cause: e
        })
    }
}

export async function genAnchorIdlAddr(program_id: PublicKey) {

    let program_signer = PublicKey.findProgramAddressSync([], program_id)[0];
    let seed = "anchor:idl"
    const result = await PublicKey.createWithSeed(program_signer, seed, program_id)
    return result
}
