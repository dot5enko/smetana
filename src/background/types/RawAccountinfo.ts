import { AccountInfo, Connection } from "@solana/web3.js"
import { getSingleAddressInfo } from "../rpc"

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

export function getSignleRawAccountInfo(conn: Connection, address: string): Promise<RawAccountInfo> {

    return getSingleAddressInfo(address, conn).then(resp => {
        if (resp.value != undefined) {
            const rawaccount: RawAccountInfo = toRawAccountInfo(resp.value, resp.context.slot, true)

            return rawaccount;
        }

        return Promise.reject("no account info found");
    })
}