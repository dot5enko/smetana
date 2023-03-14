import Dexie from 'dexie';
import { TypeOperations } from './TypeOperations';
import { Address, AddressData, DataType, DataTypeField, WatchedAddress } from './types';

export const db = new Dexie('accounts');

// todo check double initialization
db.version(1).stores({
    address: '++id, &address, type_assigned',
    data: '++id, address_id, created_at',
    watched_address: '++id, &address_id, paused',
    datatype: '++id, label, program_id, discriminator',
    datatypefield: '++id, datatype_id, order_position ',
    program: '++id, &address_id, is_anchor, fetched',
    config: '&key'
});

export const AddressHandler = new TypeOperations<Address>(db.table('address'));
export const AddressDataHandler = new TypeOperations<AddressData>(db.table('data'));
export const WatchedAddressHandler = new TypeOperations<WatchedAddress>(db.table('watched_address'));
export const DataTypeHandler = new TypeOperations<DataType>(db.table('datatype'));
export const ProgramHandler = new TypeOperations<DataTypeField>(db.table('program'));