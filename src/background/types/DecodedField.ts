import { DataTypeField } from "./DataTypeField"

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