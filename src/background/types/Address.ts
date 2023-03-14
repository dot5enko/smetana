import { AddressHandler } from "../database";
import { ItemFilter } from "./DataType";

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

export async function setAddrType(id: number, type_id: number) {
    AddressHandler.update(id, {
        type_assigned: type_id
    })
}

// todo move to templates
export async function findAddresses(queryString: string, limit: number, itemFilter?: ItemFilter<Address>): Promise<Address[]> {

    const datatype = AddressHandler.getTable();


    const qIsEmpty = queryString === "" || queryString === undefined || queryString === "null"
    const qlower = queryString

    return await datatype.filter((it: Address) => {

        // console.log(' label or color not empyt', it.label, it.labelColor, [hasLabel, hasColor]);

        // todo optimize
        const labelPassed = qIsEmpty ? true : (it.label ? it.label.toLowerCase().indexOf(qlower) != -1: false);
        const addrPassed = qIsEmpty ? true : (it.address ? it.address.indexOf(qlower) != -1 : false);

        if (!labelPassed && !addrPassed) {
            return false;
        } else {

            const hasLabel = it.label != null && it.label != "" && it.label != undefined;
            const hasColor = it.hasColor && it.labelColor != "";

            if (!qIsEmpty || hasLabel || hasColor) {
                return true;
            } else {
                return false;
            }

            // if (itemFilter) {
            //     return itemFilter(it)
            // } else {
            //     return true;
            // }
        }

    }).limit(limit).toArray()
}




