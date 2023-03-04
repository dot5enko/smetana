import Dexie from 'dexie';
import { PublicKey } from '@solana/web3.js';

export const db = new Dexie('accounts');

// todo check double initialization
db.version(2).stores({
    data: '++id, address_id_ref, created_at',
    addresses: '++id, &address, sync_flag'
});

export async function addressHistory(address: PublicKey) {

    let adrStr = address.toBase58();

    console.log('fetching account data for ', adrStr)

    return db.table('account').where('address').equals(adrStr).toArray();
}
