
import { ContentContext, PageContext } from "./context";
import { createIframe, createPopupObject } from "./popup"

const addressesToOmit = new Set<string>([
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
    "So11111111111111111111111111111111111111112",
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    "11111111111111111111111111111111"
]);

const accountLinks = new Map<string, string>([
    ["explorer.solana.com", "https://explorer.solana.com/address/"],
    ["solscan.io", "https://solscan.io/account/"],
    ["solana.fm", "https://solana.fm/address/"],
]);

var observeDOM = (function () {
    var MutationObserver = window.MutationObserver;

    return function (obj: Node, callback: MutationCallback): any {
        if (!obj || obj.nodeType !== 1) return;

        if (MutationObserver) {
            // define a new observer
            var mutationObserver = new MutationObserver(callback)

            // have the observer observe for changes in children
            mutationObserver.observe(obj, { childList: true, subtree: true })
            return mutationObserver
        } else if (window.addEventListener != null) {
            obj.addEventListener('DOMNodeInserted', callback as any, false)
            obj.addEventListener('DOMNodeRemoved', callback as any, false)
        }
    }
})()

let currentSideIsLeft = true;

function processLinksWithData(links: HTMLAnchorElement[], pageContext: ContentContext) {
    for (var it of links) {
        var hrefAttr = it.href;

        let splitParts = new URL(hrefAttr).pathname.split("\/")
        let addr = splitParts[splitParts.length - 1]

        // at this point data should already fetched
        let addrData = pageContext.getData(addr);

        if (it.querySelector(".smetanaExplorer") == null) {

            const badge = document.createElement("span");
            badge.className = "smetana-btn"

            // badge.style.backgroundColor = "#189AB4";
            badge.onclick = async function (e) {

                e.preventDefault();
                e.stopPropagation();

                const directionLeft = e.clientX > window.innerWidth / 2;
                currentSideIsLeft = directionLeft;

                let popupDiv = document.querySelector(".smetana-popup-iframe") as HTMLElement;
                let splash = document.querySelector(".smetana-splash") as HTMLElement;

                const args = [addr];

                createIframe(ext_url + "#addr_view=" + JSON.stringify(args));

                if (directionLeft) {
                    popupDiv.style.right = "";
                    popupDiv.style.left = "-500px";
                } else {
                    popupDiv.style.left = "";
                    popupDiv.style.right = "-500px";
                }

                popupDiv.style.display = "block";
                splash.style.display = "block";

                setTimeout(() => {
                    splash.style.opacity = "0.1"

                    if (directionLeft) {
                        popupDiv.style.left = "0px";
                    } else {
                        popupDiv.style.right = "0px";
                    }
                })

                // var xPosition = e.clientX + window.pageXOffset - popupDiv.clientWidth / 2;
                // var yPosition = e.clientY + window.pageYOffset - popupDiv.clientHeight / 2;

                // popupDiv.style.top = yPosition + "px";
                // popupDiv.style.left = xPosition + "px";

                let addressValueHolder = document.querySelector('.addressValue') as HTMLElement
                addressValueHolder.innerText = addr;

                // set data 
                {
                    let popupdata = document.querySelector('.popup-data') as HTMLElement
                    popupdata.innerText = JSON.stringify(addrData)

                    // current addr data 
                    // use data view strategy interface

                    const getFreshBtn = document.querySelector(".getFresh") as HTMLElement
                    getFreshBtn.setAttribute('data-id', addr)
                }
            }

            badge.classList.add("smetanaExplorer");

            let addrDATA = addrData?.address;

            if (addrDATA) {
                let label = addrDATA?.label;
                if (label) {
                    it.style.color = addrData?.address?.labelColor ?? "";
                    it.innerText = label;
                }
            }

            badge.innerText = "S";

            it.prepend(badge);
        }
        // }
    }
}

function handleUpdatedNode(domain: string, pageContext: ContentContext, docPart?: HTMLElement) {

    if (!docPart || !(docPart instanceof HTMLElement)) {
        return;
    }

    const domainPrefix = accountLinks.get(domain)

    if (domainPrefix == null) {
        console.warn('unknown/unsupported domain: ', domain)
        return
    }

    var links = docPart.querySelectorAll("a");

    if (links != null) {

        // collect all the visible accounts and check if there's data for them in extension
        {
            // addresses 

            var addrsToFetch = [];
            var linksToHandle: HTMLAnchorElement[] = [];

            for (var it of links) {
                var hrefAttr = it.href;

                if (hrefAttr.startsWith(domainPrefix)) {

                    let splitParts = new URL(hrefAttr).pathname.split("\/")
                    let addr = splitParts[splitParts.length - 1]

                    if (!addressesToOmit.has(addr)) {
                        linksToHandle.push(it);

                        if (pageContext.seen(addr)) {
                            continue;
                        } else {
                            pageContext.setSeen(addr);

                            addrsToFetch.push(addr)
                        }
                    }
                }
            }

            if (linksToHandle.length > 0) {

                if (addrsToFetch.length > 0) {
                    // got some addresses to fetch info of
                    console.log(`fetch this addrs: ${addrsToFetch.length}`, addrsToFetch)

                    pageContext.fetchAddressesStateFromHistory(addrsToFetch).then(() => {
                        processLinksWithData(linksToHandle, pageContext);
                    })

                } else {
                    processLinksWithData(linksToHandle, pageContext);
                }
            }
        }
    } else {
        console.log('no links found')
    }
}

const ext_url = chrome.runtime.getURL("index.html");

document.addEventListener("DOMContentLoaded", function () {

    const bodyObj = document.querySelector('body');

    // popup object
    {
        createPopupObject();

        // todo initialize iframe only when user clicks on address
        createIframe(ext_url);

        // setup callbacks
        {
            let getBtn = document.querySelector(".getFresh");

            // todo fix
            let popupdata = document.querySelector('.popup-data') as HTMLElement

            let popup = document.querySelector('.smetana-popup-iframe') as HTMLElement
            let splash = document.querySelector(".smetana-splash") as HTMLElement;
            splash.addEventListener('click', () => {

                // hide splash 
                splash.style.opacity = "0";
                // popup.style.opacity = "0";

                if (currentSideIsLeft) {
                    popup.style.right = "";
                    popup.style.left = "-500px";
                } else {
                    popup.style.left = "";
                    popup.style.right = "-500px";
                }

                setTimeout(() => {
                    splash.style.display = "none";
                    popup.style.display = "none";
                }, 300)

            })

            getBtn?.addEventListener('click', function (e) {
                const addrVal = getBtn?.getAttribute('data-id')

                PageContext.fetchAddressData([addrVal as string]).then((resp) => {
                    // console.log('wow, got an address data in response', resp)
                    popupdata.innerText = JSON.stringify(resp[0])
                });
            })
        }
    }

    const domain = window.location.host;

    observeDOM(bodyObj as Node, function (m) {
        for (var mutations of m) {
            for (var addedNode of mutations.addedNodes) {
                handleUpdatedNode(domain, PageContext, addedNode as HTMLAnchorElement)
            }
        }
    });
});
