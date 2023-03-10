import { db, getAddrId } from "../database"

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
}

const watchedaddresstable = db.table('watched_address');

export async function getWatchedByAddressId(addrid: number): Promise<WatchedAddress | undefined> {
    return watchedaddresstable.get({ address_id: addrid })
}

export async function createNewWatchedAddress(
    address: string,
    data_type_id: number,
    sync_interval: number,
    label: string
): Promise<WatchedAddress> {

    const addressId = await getAddrId(address);

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
            label: label
        }

        const id = await watchedaddresstable.add(newWatchedAddrObject);
        newWatchedAddrObject.id = id as number;

        return newWatchedAddrObject;
    } else {
        return watched;
    }

}
