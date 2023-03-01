
chrome.runtime.onInstalled.addListener(() => {

    if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate()
            .then(function (estimate) {
                console.log(`Using ${estimate.usage / 1024}kb out of ${estimate.quota / 1024 / 1024 / 1024}gb.`);
            });
    }

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            console.log("got a request from page", request);
            // sendResponse("received");

            chrome.windows.create({
                url: chrome.runtime.getURL("index.html"),
                type: "popup",
                width: 350,
                height: 600,
            });

        }
    );

    console.log("installed")
});


