import { db } from "../database";

export interface Address {
    id?: number
    address: string

    label: string

    hasColor?: boolean
    labelColor?: string
}

const addresstable = db.table('address');

export async function getAddresById(id: number): Promise<Address> {
    const result = await addresstable.get(id)

    if (result == null) {
        return Promise.reject("not found")
    } else {
        return result;
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

export async function updateAddress(id: number, values: any) {
    return addresstable.update(id, values);
}


