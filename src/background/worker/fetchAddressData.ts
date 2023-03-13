import { PublicKey } from "@solana/web3.js";
import { DefaultRpcCommitment } from "../rpc";
import { addNewAddressData, getAddrId, toRawAccountInfo } from "../types";
import { getRpcConnection } from "./getRpcConnection";
import { ChunkDataEntry } from "./periodicTask";
import { ResponseSender } from "./taskHandler";

export default async (request: any, sendResponse: ResponseSender) => {

    let addrs: string[] = request.address;
    let chunks: PublicKey[][] = [];

    if (addrs.length > 100) {
        sendResponse({
            "state": false,
            "type": "too much accounts",
        })
        return;
    }

    let chunk1: PublicKey[] = addrs.map((it) => new PublicKey(it))
    chunks.push(chunk1);

    {
        let mappedData: ChunkDataEntry[] = [];

        const resultMap = new Map<string, ChunkDataEntry>();

        for (var it of addrs) {
            let mapEntry: ChunkDataEntry = {
                address_id: await getAddrId(it),
                pubkey: new PublicKey(it)
            }
            resultMap.set(it, mapEntry);
        }

        for (var chunk of chunks) {

            // todo introduce pause ?
            // console.log('fetching chunk of addresses : ', chunk.length)

            try {

                const connection = await getRpcConnection();
                const accsResponse = await connection.getMultipleAccountsInfoAndContext(chunk, {
                    commitment: DefaultRpcCommitment
                })

                // console.log('done with fetching accs. got response ', accsResponse.value.length, ' length')

                let idx = 0;

                for (var respAccData of accsResponse.value) {
                    const pubkey = chunk[idx]
                    // todo optimize pk to string transform here
                    let item = resultMap.get(pubkey.toBase58());
                    if (item) {
                        if (respAccData) {

                            item.info = toRawAccountInfo(
                                respAccData,
                                accsResponse.context.slot,
                                true
                            )
                        }
                        mappedData.push(item);
                    } else {
                        console.warn('this shouldnt happen. not found item addr cache')
                    }
                }

            } catch (e: any) {

                // handle error properly
                // redo ?
                console.warn('got an error while fetching account chunks: ' + e.message, e)
            }
        }

        let curt = new Date().getTime() / 1000;
        for (var entryItem of resultMap.values()) {

            if (entryItem.info) {
                addNewAddressData(
                    entryItem.info,
                    entryItem.address_id,
                    curt,
                    await getAddrId(entryItem.info.owner)
                )
            }
        }

        sendResponse({
            "items": Array.from(mappedData.values())
        })
    }
}