import { Connection } from "@solana/web3.js"
import { getSingleAddressInfo } from "../rpc"

export interface RawAccountInfo {
    context_slot: number
    data: Uint8Array
    executable: boolean
    lamports: number
    owner: string
}

export function getSignleRawAccountInfo(conn: Connection, address: string): Promise<RawAccountInfo> {

    return getSingleAddressInfo(address, conn).then(resp => {
        if (resp.value != undefined) {
            const rawaccount: RawAccountInfo = {
                context_slot: resp.context.slot,
                data: resp.value?.data,
                executable: resp.value?.executable,
                lamports: resp.value?.lamports,
                owner: resp.value.owner.toBase58()
            }


            return rawaccount;
        }

        return Promise.reject("no account info found");
    })
}