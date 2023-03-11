import Dexie from 'dexie';
import { PublicKey } from '@solana/web3.js';
import { AddressData } from './types/AddressData';

export const db = new Dexie('accounts');

// todo check double initialization
db.version(1).stores({
    data: '++id, address_id, created_at',
    address: '++id, &address',
    watched_address: '++id, &address_id, paused',
    datatype: '++id, label, program_id, discriminator',
    datatypefield: '++id, datatype_id, order_position ',
    program: '++id, &address_id, is_anchor, fetched',
    config: '&key'
});

const datatable = db.table('data');
const addresstable = db.table('address');

export async function addressHistory(address: PublicKey) {

    let adrStr = address.toBase58();

    console.log('fetching account data for ', adrStr)

    return datatable.where('address').equals(adrStr).toArray();
}

export async function getAddresById(id: number): Promise<PublicKey> {
    const result = await addresstable.get(id)

    if (result == null) {
        return Promise.reject("not found")
    } else {
        return new PublicKey(result.address);
    }
}

export async function getAddrId(addrStr: string): Promise<number> {
    const address = await addresstable.get({ address: addrStr });

    if (address == null) {
        return await addresstable.add({
            address: addrStr,
        }) as number;
    } else {
        return Promise.resolve(address.id);
    }
}