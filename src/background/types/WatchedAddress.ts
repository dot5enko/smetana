import { Address, DataType, DataTypeSync, getAddrId } from "."
import { WatchedAddressHandler } from "../database"

export interface WatchedAddress {
    id?: number
    address_id: number
    data_type_id: number
    sync_interval: number

    label: string

    // timestamp
    last_sync: number

    // number of fails to parse address data by given type
    parse_failed_count: number

    paused: number
}

const watchedaddresstable = WatchedAddressHandler.getTable()

export async function getWatchedByAddressId(addrid: number): Promise<WatchedAddress | undefined> {
    return watchedaddresstable.get({ address_id: addrid })
}

export async function createNewWatchedAddress(
    address: Address,
    data_type: DataTypeSync,
    sync_interval: number,
    label: string
): Promise<WatchedAddress> {


    const data_type_id = data_type.typ.id as number;
    const addressId = address.id as number;

    const watched = await getWatchedByAddressId(addressId);
    if (!watched) {
        // create new 

        // todo check type existance ?
        let newWatchedAddrObject: WatchedAddress = {
            address_id: addressId,
            data_type_id: data_type_id,
            sync_interval: sync_interval,
            last_sync: 0,
            parse_failed_count: 0,
            label: label,
            paused: 0,
        }

        const id = await watchedaddresstable.add(newWatchedAddrObject);
        newWatchedAddrObject.id = id as number;

        return newWatchedAddrObject;
    } else {
        return watched;
    }
}

export async function findWatchedAddresses(label: string, limit: number): Promise<WatchedAddress[]> {

    if (label === "") {
        return await watchedaddresstable.limit(limit).toArray()
    }

    return await watchedaddresstable.filter((it: WatchedAddress) => {
        return it.label.toLowerCase().indexOf(label.toLowerCase()) != -1
    }).limit(limit).toArray()
}


export async function getActiveWatchedAddresses(): Promise<WatchedAddress[]> {

    const curtime = new Date().getTime() / 1000;

    return watchedaddresstable.where('paused').equals(0).filter((it: WatchedAddress) => {

        const diff = curtime - it.last_sync;
        const diffMinutes = diff / 60;

        if (diffMinutes >= it.sync_interval) {
            return true;
        } else {
            return false;
        }

    }).toArray();

}