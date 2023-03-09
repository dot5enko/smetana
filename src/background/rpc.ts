import { Connection, PublicKey } from "@solana/web3.js";

export async function getSingleAddressInfo(pkey: string, conn: Connection) {

    const result = await conn.getAccountInfoAndContext(new PublicKey(pkey), {
        'commitment': 'finalized',
    })

    return result;
}