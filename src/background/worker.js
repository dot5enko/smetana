import * as solanaweb3 from "@solana/web3.js"

function setup(web3) {

    console.log("startup begin");

    let connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"), "confirmed");
    console.log('started. subscribed for messages', connection)

    console.log('chrome.alarms = ', chrome)

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
            nonceAccount.publicKey,
            "confirmed",
        ).then((respdata) => {
            console.log('got fetched result : ', respdata.data)
        }).fail((errFound) => {
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
    console.log('setup finished')

}

chrome.runtime.onInstalled.addListener(() => {

    if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate()
            .then(function (estimate) {
                console.log(`Using ${estimate.usage / 1024}kb out of ${estimate.quota / 1024 / 1024 / 1024}gb.`);
            });
    }

    // setup(solanaweb3);
});


chrome.runtime.onConnect.addListener(
    function () {
        console.log('connection received, subscribe for messages please...')
    },
)

chrome.runtime.onStartup.addListener(() => {
    try {
        // setup(solanaweb3,);
    } catch (err) {
        console.error('unable to init extension: ', err.message)
    }
})


setup(solanaweb3)



