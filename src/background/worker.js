import { Connection, PublicKey } from "@solana/web3.js"

function setup() {

    try {
        let connection = new Connection("https://rpc.ankr.com/solana", "confirmed");
        console.log('started. subscribed for messages', connection)

        chrome.alarms.onAlarm.addListener((alarm) => {
            // perform background actions
            console.log("do some work here...")
        })

        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            console.log("got a request from page", request);
            // sendResponse("received");

            let addr = request.address;
            console.warn('address to fetch now : ', addr)

            connection.getAccountInfo(
                new PublicKey(addr),
                "confirmed",
            ).then((respdata) => {
                console.log('got fetched result : ', respdata.data)
            }).catch((errFound) => {
                console.warn('error while fetching data: ', errFound)
            });

            chrome.windows.create({
                url: chrome.runtime.getURL("index.html"),
                type: "popup",
                width: 350,
                height: 600,
            });
        });

        chrome.alarms.create({ periodInMinutes: 1 })
        console.log('extension initialized')
    } catch (err) {
        console.error('unable to init extension: ', err.message)
    }
}

chrome.runtime.onStartup.addListener(() => {
})

setup()