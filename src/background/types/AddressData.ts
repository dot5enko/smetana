import { Connection } from "@solana/web3.js"
import { timeNow } from "../../popup/components/menu"
import { AddressDataHandler, AddressHandler } from "../database"
import { getRpcConnection } from "../worker/getRpcConnection"
import { Address, setAddrIdOwner } from "./Address"
import { getSignleRawAccountInfo, RawAccountInfo } from "./RawAccountinfo"

export interface AddressData {

    id?: number

    address_id: number
    created_at: number

    data: Uint8Array
    lamports: number
    context_slot: number
}

export interface HistoryResponse {
    total: number,
    filtered: AddressData[]
}

export async function forceFetchData(connection: Connection, address: Address): Promise<AddressData> {

    await getSignleRawAccountInfo(connection, address);
    const refreshed = await getHistory(address.id as number, 1);

    return refreshed.filtered[0];
}

export async function getLastHistoryEntryOrFetch(connection: Connection, address: Address, expiry_seconds: number = 0): Promise<AddressData> {

    console.log(' getting history or fetching ... ', address.address)

    if (expiry_seconds === -1) {
        // fetch fresh
        return forceFetchData(connection, address)
    } else {
        const lastHistory = await getHistory(address.id as number, 1);

        let expired = true;
        const item = lastHistory.filtered[0] ?? undefined;

        if (lastHistory.total != 0) {
            const time_passed = timeNow() - item.created_at;
            expired = time_passed > expiry_seconds;
        }

        if (expired) {
            return forceFetchData(connection, address)
        } else {
            return item;
        }

    }
}

export async function getHistory(address_id: number, limit: number): Promise<HistoryResponse> {

    const datatable = AddressDataHandler.getTable();

    let filtered = datatable.where("address_id").equals(address_id);

    let counter = await filtered.count();

    let items = await filtered.
        limit(limit).
        reverse().
        sortBy('created_at')

    return { total: counter, filtered: items }

}

export async function addNewAddressData(data: RawAccountInfo, address_id: number, t: number, owner?: number) {

    const item: AddressData = {
        address_id,
        created_at: t,
        data: data.data,
        lamports: data.lamports,
        context_slot: data.context_slot,
    }

    const datatable = AddressDataHandler.getTable();

    if (owner) {
        await setAddrIdOwner(
            item.address_id,
            owner,
            item.data.length
        )
    }

    return datatable.add(item);
}