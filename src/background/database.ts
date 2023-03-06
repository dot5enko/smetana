import Dexie from 'dexie';
import { PublicKey } from '@solana/web3.js';

export const db = new Dexie('accounts');

// todo check double initialization
db.version(2).stores({
    data: '++id, address_id, created_at',
    address: '++id, &address, sync_flag',
    datatype: '++id, label',
});

export async function addressHistory(address: PublicKey) {

    let adrStr = address.toBase58();

    console.log('fetching account data for ', adrStr)

    return db.table('account').where('address').equals(adrStr).toArray();
}


export async function getAddrId(addrStr: string): Promise<number> {
    const addrTable = db.table('address');
    const address = await addrTable.get({ address: addrStr });

    if (address == null) {
        return await addrTable.add({
            address: addrStr,
        }) as number;
    } else {
        return Promise.resolve(address.id);
    }

}