import { PublicKey } from "@solana/web3.js";
import { DataType, DecodeTypeResult } from "./types/DataType";
import { DataTypeField, getFieldsForType } from "./types/DataTypeField";
import { DecodedField, DecodeFieldResult } from "./types/DecodedField";
import * as borsh from "borsh"
import { Buffer } from "buffer"

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

// todo check borsh specification
export function decodeSimpleType(data: Uint8Array, typ: DataTypeField): DecodeFieldResult {

    let result: DecodeFieldResult = {
        error: undefined,
        outvalue: undefined,
        bytesUsed: 0,
    };

    let size = typ.optional ? 1 : 0;

    let optionalPresentFlagValue = false;

    if (typ.optional) {
        if (data.length == 0) {
            result.error = 'underflow'
            return result;
        } else {
            optionalPresentFlagValue = data[0] > 0;
        }
    }

    if (typ.optional && !optionalPresentFlagValue) {

        result.bytesUsed += size;
        result.contains = optionalPresentFlagValue;

        return result
    } else {

        const reader = new borsh.BinaryReader(Buffer.from(data.slice(size)));

        if (typ.is_array) {

            let resultArray = [];
            const arrayElementTyp: DataTypeField = {
                ...typ,
                is_array: false,
                optional: false
            };

            let array_bytes_used = 0;

            let elements_to_read = typ.array_size;

            if (typ.is_dynamic_size) {

                // read u32 dyn size value first
                elements_to_read = reader.readU32()

                // count this in global offset
                array_bytes_used += 4;
                // todo validate size somehow ?
            }

            for (var i = 0; i < elements_to_read; i++) {
                let elementDecodeResult = decodeSimpleType(data.slice(array_bytes_used), arrayElementTyp)
                if (elementDecodeResult.error) {

                    // todo provide proper result
                    return elementDecodeResult;
                } else {
                    array_bytes_used += elementDecodeResult.bytesUsed;
                    resultArray.push(elementDecodeResult.outvalue)
                }
            }

            size += array_bytes_used;
            result.outvalue = resultArray

        } else {

            switch (typ.field_type) {
                case "u8":
                case "i8":
                    result.outvalue = reader.readU8()
                    size += 1;
                    break;
                case "bool":
                    size += 1;
                    break;
                case "u16":
                case "i16":
                    result.outvalue = reader.readU16()
                    size += 2;
                    break;
                case "u32":
                case "i32":
                    result.outvalue = reader.readU32()
                    size += 4;
                    break;
                case "u64":
                case "i64":
                    result.outvalue = reader.readU64()
                    size += 8;
                    break;
                case "u128":
                case "i128":
                    result.outvalue = reader.readU128()
                    size += 16;
                    break;
                case "publicKey":
                    result.outvalue = new PublicKey(reader.readFixedArray(32))
                    size += 32;
                    break;
                default:
                    throw new Error(`unable to decode unknown type of data: "${typ.field_type}"`)
            }
        }

        result.bytesUsed += size;

        return result;
    }
}