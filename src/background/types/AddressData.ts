import { Address } from "cluster"
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

export interface HistoryResponse {
    total: number,
    filtered: AddressData[]
}

export async function getHistory(address_id: number, limit: number): Promise<HistoryResponse> {


    let filtered = datatable.where("address_id").equals(address_id);

    let counter = await filtered.count();

    let items = await filtered.
        limit(limit).
        reverse().
        sortBy('created_at')

    return { total: counter, filtered: items }

}

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