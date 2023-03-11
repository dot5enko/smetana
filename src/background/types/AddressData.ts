import { db } from "../database"
import { RawAccountInfo } from "./RawAccountinfo"

export interface AddressData {

    id?: number

    address_id: number
    created_at: number

    data: Uint8Array
    lamports: number
    context_slot: number
}

const datatable = db.table("data");

export async function addNewAddressData(data: RawAccountInfo, address_id: number, t: number) {

    const item: AddressData = {
        address_id,
        created_at: t,
        data: data.data,
        lamports: data.lamports,
        context_slot: data.context_slot
    }

    return datatable.add(item);
}