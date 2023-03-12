import { Connection, PublicKey } from "@solana/web3.js"
import { AddressHandler, db } from "./database"
import { getKeyValueFromDb, RpcConfigKey } from "./storage"
import { DefaultRpcServer } from "./rpc"
import { doPeriodicTask } from "./worker/periodicTask";
import { getAddrId } from "./types";
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

            try {
                console.log(`got a request from page : command ${request.command}`);

                switch (request.command) {
                    case "fetch_addresses_state": {

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


                                    const responseItem: ContentResponse = {
                                        Address: addrInfo,
                                        LastData: cached
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

                        let addrs = request.address;

                        if (addrs.length > 1) {
                            sendResponse({
                                "state": false,
                                "type": "more than 1 address not supported rn",
                            })
                            return true
                        }

                        // hardcoded 1 address as of now

                        let curAddrStr = addrs[0];
                        let addr = new PublicKey(curAddrStr);
                        console.warn('address to fetch now : ', curAddrStr)

                        connection.getAccountInfo(
                            addr,
                            "confirmed",
                        ).then(async (respdata) => {

                            const addrId = await getAddrId(curAddrStr);

                            db.table('data').add({
                                address_id: addrId,
                                created_at: new Date(),
                                data: respdata?.data,
                            }).then((addrid) => {

                                sendResponse([{
                                    key: curAddrStr,
                                    lastDataTime: new Date(),
                                    lastData: respdata?.data
                                }])

                            }).catch((dberr) => {
                                console.warn("unable to store item to database : ", dberr.message)
                            });
                        }).catch((errFound) => {
                            sendResponse({
                                "state": false,
                                "type": "fetch error",
                                "err": errFound.message
                            })
                        });

                    } break;
                    default: {
                        console.warn(`unknown command ${request.command}`)
                        sendResponse({
                            "state": false,
                            "type": "unknown command",
                        })
                    }
                }
            } catch (e: any) {
                sendResponse({
                    "state": false,
                    "type": "handle exception",
                    "err": e.message
                });
            }

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
