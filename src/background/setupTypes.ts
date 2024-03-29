import { getAndSet, setKeyValueToDb } from "./storage";
import { DataTypeField, importType, ParsedTypeFromIdl } from "./types";


function field(name: string, typ: string, optional: boolean, idx: number, referenced_type?: number): DataTypeField {
    let result: DataTypeField = {
        datatype_id: 0,
        order_position: idx,
        optional: optional,
        label: name,
        field_type: typ,
        is_complex_type: false,
        is_array: false,
        array_size: 0,
        is_dynamic_size: false,
        hide: false,
        references_type: referenced_type != undefined,
        referenced_type_id: referenced_type
    };

    return result;
}
const setup_done_key = "setup_types";

export async function setup_types(): Promise<boolean> {

    let setup_done = await getAndSet(setup_done_key, "0", "1");

    if (setup_done == "0") {

        console.log('default types initalization start!');

        const tokeneg = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        const spl_mint: ParsedTypeFromIdl = {
            fields: [
                field("mint_authority", "publicKey", true, 0),
                field("supply", "u64", false, 1),
                field("decimals", "u8", false, 2),
                field("is_initialized", "bool", false, 3),
                field("freeze_authority", "publicKey", true, 4),
            ],
            info: {
                used_by: 0,
                fields_count: 0,
                size_bytes: 0
            },
            complex: false,
            name: "token mint",
            struct: true,
            discriminator: new Uint8Array(0)
        }

        const mint_type_id = await importType(tokeneg, spl_mint);


        const spl_token: ParsedTypeFromIdl = {
            fields: [
                field("mint", "publicKey", false, 0, mint_type_id),
                field("owner", "publicKey", false, 1),
                field("amount", "u64", false, 2),
                field("delegate", "publicKey", true, 3),
                field("state", "u8", false, 4),
                field("is_native", "u64", true, 5),
                field("delegated_amount", "u64", false, 6),
                field("close_authority", "publicKey", true, 7),
            ],
            info: {
                used_by: 0,
                fields_count: 0,
                size_bytes: 0
            },
            complex: false,
            name: "associated token account",
            struct: true,
            discriminator: new Uint8Array(0)
        }
        await importType(tokeneg, spl_token);

        return true;
    }

    return false;
}
