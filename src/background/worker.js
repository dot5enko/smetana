import { Connection, PublicKey } from "@solana/web3.js"
import { db, addressHistory } from "./database"

function setup() {

    try {
        let connection = new Connection("https://rpc.ankr.com/solana", "confirmed");
        console.log('started. subscribed for messages', connection)

        chrome.alarms.onAlarm.addListener((alarm) => {
            // perform background actions
            console.log("do some work here...")
        })

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            console.log("got a request from page", request);
            // sendResponse("received");

            let addr = new PublicKey(request.address);
            console.warn('address to fetch now : ', addr)

            // addressHistory(addr).then((historyItems) => {
            //     console.log("history items : ", historyItems)
            // })

            connection.getAccountInfo(
                addr,
                "confirmed",
            ).then((respdata) => {
                db.table('account').add({
                    address: addr.toBase58(),
                    created_at: new Date(),
                    data: respdata.data,
                }).then((addrid) => {

                    sendResponse({
                        "state": true,
                        "type": "latest_data",
                        "data": respdata
                    })

                }).catch((dberr) => {
                    console.warn("unable to store item to database : ", dberr.message)
                });
            }).catch((errFound) => {
                sendResponse({
                    "state": false,
                    "type": "node error",
                    "err": errFound.message
                })
            });

            chrome.windows.create({
                url: chrome.runtime.getURL("index.html"),
                type: "popup",
                width: 350,
                height: 600,
            });

            return true;
        });

        chrome.alarms.create({ periodInMinutes: 1 })
        console.log('extension initialized')
    } catch (err) {
        console.error('unable to init extension: ', err.message)
    }
}

chrome.runtime.onInstalled.addListener(() => {

})

chrome.runtime.onStartup.addListener(() => {

})

setup()