import { AddressHandler, db } from "../database";
import { TypeOperations } from "../TypeOperations";

export interface Address {
    id?: number
    address: string

    label: string

    hasColor?: boolean
    labelColor?: string
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

