import { Connection, PublicKey } from "@solana/web3.js";
import { AddressHandler, WatchedAddressHandler } from "../database";
import { DefaultRpcCommitment, DefaultRpcServer } from "../rpc";
import { getKeyValueFromDb, RpcConfigKey } from "../storage";
import { getActiveWatchedAddresses, getAddrId, RawAccountInfo, setAddrIdOwner, toRawAccountInfo, WatchedAddress } from "../types";
import { addNewAddressData } from "../types/AddressData";

async function addrChunks(list: WatchedAddress[], size: number, entryMap: Map<string, ChunkDataEntry>): Promise<PublicKey[][]> {

    let result = [];
    let curChunk: PublicKey[] = [];

    for (var it of list) {
        const addr = await AddressHandler.getById(it.address_id);

        const addrPk = new PublicKey(addr.address);
        curChunk.push(addrPk);

        // push map outside
        // todo eliminate toBase58 call here 
        entryMap.set(addr.address, {
            address_id: it.address_id,
            pubkey: addrPk,
            info: undefined,
            watched: it
        })

        if (curChunk.length == size) {
            result.push(curChunk);
            curChunk = [];
        }
    }

    result.push(curChunk);

    return result;
}

export interface ChunkDataEntry {
    address_id: number,
    pubkey: PublicKey,
    info?: RawAccountInfo
    watched?: WatchedAddress
}

async function processData(items: ChunkDataEntry[]) {

    let curt = new Date().getTime() / 1000;

    for (var it of items) {

        let w = it.watched as WatchedAddress;

        await WatchedAddressHandler.update(w.id as number, {
            last_sync: curt
        })

        // decode here or no ?

        // write data to storage
        await addNewAddressData(it.info as RawAccountInfo, it.address_id, curt);

        // insert data
        console.log(`data for ${it.pubkey} fetched and stored`)
    }

}

export async function doPeriodicTask() {

    console.log("doPeriodicTask() called")

    const addrChunkSize = 100;

    let rpcAddr = await getKeyValueFromDb(RpcConfigKey, DefaultRpcServer);

    const addressesToFetch = await getActiveWatchedAddresses();

    const resultMap = new Map<string, ChunkDataEntry>();

    const len = addressesToFetch.length;

    if (len > 0) {
        console.log(`going to fetch ${len} addresses now`)

        const connection = new Connection(rpcAddr, DefaultRpcCommitment);

        // generate chunks

        const chunks = await addrChunks(addressesToFetch, addrChunkSize, resultMap);

        let mappedData: ChunkDataEntry[] = [];

        for (var chunk of chunks) {

            try {

                const accsResponse = await connection.getMultipleAccountsInfoAndContext(chunk, {
                    commitment: DefaultRpcCommitment
                })

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
                                false
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

        processData(mappedData);
    }

}