import { AddressHandler } from "../database";

export interface Address {
    id?: number
    address: string

    label: string

    hasColor?: boolean
    labelColor?: string

    program_owner: number
    datalen: number

    type_assigned?: number
}

export async function getAddrId(addrStr: string): Promise<number> {

    const table = AddressHandler.getTable();

    // this eliminates concurent object creation
    return table.db.transaction('rw', table, async () => {
        const address = await table.get({ address: addrStr });

        try {
            if (address == null) {
                const newId = await table.add({
                    address: addrStr,
                }) as number;

                return newId;
            } else {
                return address.id;
            }
        } catch (e: any) {
            console.error(`error getting id for addr ${addrStr}`, e)
            throw e;
        }
    })


}

export async function setAddrIdOwner(id: number, owner_id: number, datalen: number) {

    // todo fetch first ?

    return AddressHandler.update(id, {
        program_owner: owner_id,
        datalen: datalen
    })
}

export async function setAddrType(id: number, type_id : number) {
    AddressHandler.update(id, {
        type_assigned: type_id
    })
}

