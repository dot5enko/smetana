import { setup_types } from "./setupTypes";
import fetchAddressData from "./worker/fetchAddressData";
import fetchAddressState from "./worker/fetchAddressState";
import doPeriodicTask from "./worker/periodicTask";

async function setup() {

    try {

        const addAlarmListener = chrome.alarms.onAlarm.addListener((alarm) => {
            doPeriodicTask()
        })

        console.log('added alarm listener', addAlarmListener)

        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

            console.log(`got a request from page : command ${request.command}`);

            (async () => {
                switch (request.command) {
                    case "fetch_addresses_state": {
                        fetchAddressState(request, sendResponse)
                    }
                        break;
                    case "fetch_addresses_data": {
                        fetchAddressData(request, sendResponse)
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

            return true;
        });

        console.log('extension initialized')
    } catch (err: any) {
        console.error('unable to init extension: ', err.message)
    }
}

chrome.runtime.onInstalled.addListener(() => {

    setup_types();

    chrome.alarms.get('bgtask', bgtask => {
        if (!bgtask) {
            chrome.alarms.create('bgtask', { periodInMinutes: 30 / 60 });
        }
    });
})

setup_types();
setup()