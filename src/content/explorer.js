var observeDOM = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    return function (obj, callback) {
        if (!obj || obj.nodeType !== 1) return;

        if (MutationObserver) {
            // define a new observer
            var mutationObserver = new MutationObserver(callback)

            // have the observer observe for changes in children
            mutationObserver.observe(obj, { childList: true, subtree: true })
            return mutationObserver
        }

        // browser support fallback
        else if (window.addEventListener) {
            obj.addEventListener('DOMNodeInserted', callback, false)
            obj.addEventListener('DOMNodeRemoved', callback, false)
        }
    }
})()

import pcontext from './context'
import { createPopupObject } from "./popup"

function processLinksWithData(links, pageContext) {
    for (var it of links) {
        var hrefAttr = it.href;

        if (hrefAttr.startsWith("https://solscan.io/account")) {

            let splitParts = hrefAttr.split("\/")
            let addr = splitParts[splitParts.length - 1]

            // at this point data should already fetched
            let addrData = pageContext.getData(addr);

            if (it.querySelector(".smetanaExplorer") == null) {

                const badge = document.createElement("span");
                badge.style.border = "1px solid black"
                badge.style.padding = "4px"
                badge.style.marginRight = "10px";
                badge.style.borderRadius = "4px";
                badge.style.color = 'white';
                badge.style.backgroundColor = "#189AB4";
                badge.onclick = async function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    let popupDiv = document.querySelector(".smetanaPopup");

                    var xPosition = e.clientX + window.pageXOffset;
                    var yPosition = e.clientY + window.pageYOffset;

                    popupDiv.style.top = yPosition + "px";
                    popupDiv.style.left = xPosition + "px";
                    popupDiv.style.display = "block";
                    popupDiv.style.opacity = 0;
                    popupDiv.style.opacity = 1;

                    console.log(' popup location should be ', e.offsetX, e.offsetY);
                }

                badge.classList.add("smetanaExplorer");
                badge.innerText = "@" + addr.substring(0, 4);

                it.prepend(badge);
            }
            // }
        }
    }
}

function handleUpdatedNode(pageContext, docPart) {

    if (docPart == null) {
        return;
    }

    var links = docPart.querySelectorAll("a");

    if (links != null) {

        // collect all the visible accounts and check if there's data for them in extension
        {
            // addresses 

            var addrsToFetch = [];

            var linksToHandle = [];

            for (var it of links) {
                var hrefAttr = it.href;

                if (hrefAttr.startsWith("https://solscan.io/account")) {

                    let splitParts = hrefAttr.split("\/")
                    let addr = splitParts[splitParts.length - 1]

                    linksToHandle.push(it);

                    if (pageContext.seen(addr)) {
                        continue;
                    } else {
                        pageContext.setSeen(addr);
                        addrsToFetch.push(addr)
                    }
                }
            }

            if (linksToHandle.length > 0) {

                if (addrsToFetch.length > 0) {
                    // got some addresses to fetch info of
                    console.log(`fetch this addrs: ${addrsToFetch.length}`, addrsToFetch)
                }

                processLinksWithData(linksToHandle, pageContext);
            }
        }
    } else {
        console.log('no links found')
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const bodyObj = document.querySelector('body');

    // popup object
    createPopupObject();

    observeDOM(bodyObj, function (m) {
        for (var mutations of m) {
            for (var addedNode of mutations.addedNodes) {
                handleUpdatedNode(pcontext, addedNode)
            }
        }
    });

});
