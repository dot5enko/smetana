import { Connection, PublicKey } from "@solana/web3.js"
import { AddressDataHandler, AddressHandler, db } from "./database"
import { getKeyValueFromDb, RpcConfigKey } from "./storage"
import { DefaultRpcCommitment, DefaultRpcServer } from "./rpc"
import { ChunkDataEntry, doPeriodicTask } from "./worker/periodicTask";
import { addNewAddressData, getAddrId, getTypeToDecode, RawAccountInfo, setAddrIdOwner, toRawAccountInfo } from "./types";
import { ContentResponse } from "./types/ContentResponse";

async function setup() {

    try {

        let rpcAddr = await getKeyValueFromDb(RpcConfigKey, DefaultRpcServer);

        console.log(`started with rpc: ${rpcAddr}`)

        let connection = new Connection(rpcAddr, "confirmed");
        console.log('started. subscribed for messages', connection)

        const addAlarmListener = chrome.alarms.onAlarm.addListener((alarm) => {
            doPeriodicTask()
        })

        console.log('added alarm listener', addAlarmListener)

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

            console.log(`got a request from page : command ${request.command}`);

            (async () => {
                switch (request.command) {
                    case "fetch_addresses_state": {

                        console.log('ext_url', chrome.runtime.getURL(
                            ""
                        ));


                        // fetch cache from database
                        let addrs = request.address;

                        let response_state: ContentResponse[] = [];

                        //   sync 
                        let doneRequests = 0;

                        for (var curidx in addrs) {

                            let addrStr = addrs[curidx];

                            (async (curAddrStr) => {
                                try {
                                    const addrId = await getAddrId(curAddrStr);
                                    const addrInfo = await AddressHandler.getById(addrId);

                                    let cached = await db.table('data').get({
                                        address_id: addrId
                                    })

                                    // check if there is type 
                                    let typ = await getTypeToDecode(addrId, false);

                                    const totalEntries = await AddressDataHandler.getTable().where('address_id').equals(addrInfo.id as number).count();

                                    const responseItem: ContentResponse = {
                                        Address: addrInfo,
                                        LastData: cached,
                                        Type: typ.typ,
                                        DataCount: totalEntries
                                    }

                                    response_state.push(responseItem);

                                } catch (e: any) {
                                    console.warn("unable to get item from indexed db:", e.message)
                                }

                                if (doneRequests === (addrs.length - 1)) {
                                    console.log('response sent')
                                    sendResponse(response_state)
                                }

                                doneRequests += 1;

                            })(addrStr)
                        }
                    }
                        break;
                    case "fetch_addresses_data": {

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
                    } break;
                    default: {
                        console.warn(`unknown command ${request.command}`)
                        sendResponse({
                            "state": false,
                            "type": "unknown command",
                        })
                    }
                }

            })().catch((e: any) => {
                sendResponse({
                    "state": false,
                    "type": "handle exception",
                    "err": e.message
                });
            })



            // chrome.windows.create({
            //     url: chrome.runtime.getURL("index.html"),
            //     type: "popup",
            //     width: 350,
            //     height: 600,
            // });

            return true;
        });

        console.log('extension initialized')
    } catch (err: any) {
        console.error('unable to init extension: ', err.message)
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.alarms.get('bgtask', bgtask => {
        if (!bgtask) {
            chrome.alarms.create('bgtask', { periodInMinutes: 30 / 60 });
        }
    });
})

setup()
