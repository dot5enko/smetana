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

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log('got a response', message)
// })

function docloaded() {

    console.log('parse links ...');
    var links = document.querySelectorAll("a");

    if (links != null) {
        console.log(`found ${links.length} on this page`);

        for (var it of links) {
            var hrefAttr = it.href;

            if (hrefAttr.startsWith("https://solscan.io/account")) {

                let splitParts = hrefAttr.split("\/")
                let addr = splitParts[splitParts.length - 1]

                if (it.querySelector(".smetanaExplorer") == null) {

                    // check if its address 
                    // if (addr.length == 44) {
                    console.log(`-- ${hrefAttr} -> ${addr}`)

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

                        chrome.runtime.sendMessage({
                            "smetana": true,
                            "address": addr,
                        }, (resp) => {
                            console.log('awaiting response :', resp, chrome.runtime.lastError)
                        });

                    }

                    badge.classList.add("smetanaExplorer");
                    badge.innerText = "@" + addr.substring(0, 4);

                    it.prepend(badge);
                }
                // }
            }
        }
    } else {
        console.log('no links found')
    }
}

let lastTime = new Date().getTime();

document.addEventListener("DOMContentLoaded", function () {

    const bodyObj = document.querySelector('body');
    observeDOM(bodyObj, function (m) {
        lastTime = new Date().getTime();

        setTimeout(function () {
            // check if diff more than 1 secx
            const lastFired = new Date().getTime() - lastTime;
            if (lastFired > 200) {
                docloaded();
            }
        }, 250)

    });
});