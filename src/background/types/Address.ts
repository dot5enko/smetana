import { db } from "../database";
import { TypeOperations } from "../TypeOperations";

export interface Address {
    id?: number
    address: string

    label: string

    hasColor?: boolean
    labelColor?: string
}

const addresstable = db.table('address');

export const AddressHandler = new TypeOperations<Address>(addresstable);

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

