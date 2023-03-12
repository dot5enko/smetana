import Dexie from 'dexie';

export const db = new Dexie('accounts');

// todo check double initialization
db.version(1).stores({
    address: '++id, &address',
    data: '++id, address_id, created_at',
    watched_address: '++id, &address_id, paused',
    datatype: '++id, label, program_id, discriminator',
    datatypefield: '++id, datatype_id, order_position ',
    program: '++id, &address_id, is_anchor, fetched',
    config: '&key'
});