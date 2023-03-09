import Dexie from 'dexie';
import { PublicKey } from '@solana/web3.js';

export const db = new Dexie('accounts');

// todo check double initialization
db.version(1).stores({
    data: '++id, address_id, created_at',
    address: '++id, &address, sync_flag, data_type_id',
    datatype: '++id, label, program_id, discriminator, is_anchor',
    datatypefield: '++id, datatype_id, order_position ',
    program: '++id, &address_id, is_anchor, fetched'
});

const datatable = db.table('data');
const addresstable = db.table('address');

export async function addressHistory(address: PublicKey) {

    let adrStr = address.toBase58();

    console.log('fetching account data for ', adrStr)

    return datatable.where('address').equals(adrStr).toArray();
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