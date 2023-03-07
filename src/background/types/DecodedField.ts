import { DataTypeField } from "./DataTypeField"
import * as borsh from "borsh"
import { PublicKey } from "@solana/web3.js"
import {Buffer} from "buffer"

export interface DecodedField {
    field: DataTypeField,
    decoded_value: any
    present?: boolean
}

export type DecodeFieldError = 'underflow' | 'malformed'

export interface DecodeFieldResult {
    error: undefined | DecodeFieldError,
    outvalue: any
    bytesUsed: number
    contains?: boolean
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

        switch (typ.field_type) {
            case "u8":
            case "i8":
                result.outvalue = reader.readU8()
                size += 1;
                break;
            case "string":
            case "bool":

                if (typ.field_type === "string") {
                    console.log("string size cant be determined beforehand, force 1 byte")
                }

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
        }

        result.bytesUsed += size;

        return result;
    }
}