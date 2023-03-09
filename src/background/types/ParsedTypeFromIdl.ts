import { DataTypeAggregatedInfo } from "./DataType"
import { DataTypeField } from "./DataTypeField"

export interface ParsedTypeFromIdl {
    fields: DataTypeField[]
    info: DataTypeAggregatedInfo
    complex: boolean
    name: string
    struct: boolean

    discriminator: Uint8Array
}