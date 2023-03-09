import Dexie from 'dexie';
import { PublicKey } from '@solana/web3.js';

export const db = new Dexie('accounts');

// todo check double initialization
db.version(2).stores({
    data: '++id, address_id, created_at',
    address: '++id, &address, sync_flag, data_type_id',
    datatype: '++id, label, program_id',
    datatypefield: '++id, datatype_id, order_position ',
});

db.version(3).stores({
    data: '++id, address_id, created_at',
    address: '++id, &address, sync_flag, data_type_id',
    datatype: '++id, label, program_id, discriminator',
    datatypefield: '++id, datatype_id, order_position ',
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