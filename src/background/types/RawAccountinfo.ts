import { AccountInfo, Connection } from "@solana/web3.js"
import { getSingleAddressInfo } from "../rpc"
import { getAddrId, addNewAddressData, Address } from "."
import { timeNow } from "../../popup/components/menu"

export interface RawAccountInfo {
    context_slot: number
    data: Uint8Array
    executable: boolean
    lamports: number
    owner: string
}

export function toRawAccountInfo(acc: AccountInfo<Buffer>, slot: number, includeOwner: boolean = false) {
    const rawaccount: RawAccountInfo = {
        context_slot: slot,
        data: acc.data,
        executable: acc.executable,
        lamports: acc.lamports,
        owner: includeOwner ? acc.owner.toBase58() : ""
    }

    return rawaccount;
}

export async function getSignleRawAccountInfo(conn: Connection, address: Address): Promise<RawAccountInfo> {

    if (address == null || address == undefined) {
        console.error('looks like address is empty when getSignleRawAccountInfo')
    }

    const resp = await getSingleAddressInfo(address.address, conn);
    if (resp.value != undefined) {

        const rawaccount: RawAccountInfo = toRawAccountInfo(resp.value, resp.context.slot, true);

        let program_id = address.program_owner;

        if (address.program_owner == null || address.program_owner == 0) {
            program_id = await getAddrId(resp.value?.owner.toBase58() as string)
        }

        await addNewAddressData(
            rawaccount,
            address.id as number,
            timeNow(),
            program_id,
        )

        return rawaccount;
    }

    return Promise.reject(`no account info found for ${address}`);
}