import { Connection, PublicKey } from "@solana/web3.js";

export const DefaultRpcServer = "https://try-rpc.mainnet.solana.blockdaemon.tech";
export const DefaultRpcCommitment = 'finalized'

export async function getSingleAddressInfo(pkey: string, conn: Connection) {

    const result = await conn.getAccountInfoAndContext(new PublicKey(pkey), {
        'commitment': 'finalized',
    })

    return result;
}