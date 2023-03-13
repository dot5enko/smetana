import { AddressHandler } from "../database";

export interface Address {
    id?: number
    address: string

    label: string

    hasColor?: boolean
    labelColor?: string
    program_owner: number
}

export async function getAddrId(addrStr: string): Promise<number> {

    const table = AddressHandler.getTable();

    const address = await table.get({ address: addrStr });

    if (address == null) {
        return await table.add({
            address: addrStr,
        }) as number;
    } else {
        return Promise.resolve(address.id);
    }
}

export async function setAddrIdOwner(id: number, owner_id: number) {
    return AddressHandler.getTable().update(id, {
        program_owner: owner_id
    })
}

