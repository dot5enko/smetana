import Dexie from 'dexie';
import { PublicKey } from '@solana/web3.js';

export const db = new Dexie('accounts');

const tableName = "account";

// todo check double initialization
db.version(2).stores({
    account: '++id, address, created_at, data',
});

export async function addressHistory(address: PublicKey) {

    let adrStr = address.toBase58();

    console.log('fetching account data for ', adrStr)

    return db.table('account').where('address').equals(adrStr).toArray();
}
