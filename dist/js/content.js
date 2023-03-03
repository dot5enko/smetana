/******/ (function() { // webpackBootstrap
var __webpack_exports__ = {};
/*!*****************************!*\
  !*** ./content/explorer.js ***!
  \*****************************/

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
                    badge.onclick = function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        chrome.runtime.sendMessage({
                            "smetana": true,
                            "address": addr,
                        });

                        console.log('msg sent ?')

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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianMvY29udGVudC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNENBQTRDLGdDQUFnQztBQUM1RTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7OztBQUdEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSw2QkFBNkIsY0FBYzs7QUFFM0M7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxzQ0FBc0MsVUFBVSxLQUFLLEtBQUs7O0FBRTFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qjs7QUFFekI7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVCxLQUFLO0FBQ0wsQ0FBQyxFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vY29udGVudC9leHBsb3Jlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBvYnNlcnZlRE9NID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgTXV0YXRpb25PYnNlcnZlciA9IHdpbmRvdy5NdXRhdGlvbk9ic2VydmVyIHx8IHdpbmRvdy5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmosIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghb2JqIHx8IG9iai5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuO1xuXG4gICAgICAgIGlmIChNdXRhdGlvbk9ic2VydmVyKSB7XG4gICAgICAgICAgICAvLyBkZWZpbmUgYSBuZXcgb2JzZXJ2ZXJcbiAgICAgICAgICAgIHZhciBtdXRhdGlvbk9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2FsbGJhY2spXG5cbiAgICAgICAgICAgIC8vIGhhdmUgdGhlIG9ic2VydmVyIG9ic2VydmUgZm9yIGNoYW5nZXMgaW4gY2hpbGRyZW5cbiAgICAgICAgICAgIG11dGF0aW9uT2JzZXJ2ZXIub2JzZXJ2ZShvYmosIHsgY2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pXG4gICAgICAgICAgICByZXR1cm4gbXV0YXRpb25PYnNlcnZlclxuICAgICAgICB9XG5cbiAgICAgICAgLy8gYnJvd3NlciBzdXBwb3J0IGZhbGxiYWNrXG4gICAgICAgIGVsc2UgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBvYmouYWRkRXZlbnRMaXN0ZW5lcignRE9NTm9kZUluc2VydGVkJywgY2FsbGJhY2ssIGZhbHNlKVxuICAgICAgICAgICAgb2JqLmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU5vZGVSZW1vdmVkJywgY2FsbGJhY2ssIGZhbHNlKVxuICAgICAgICB9XG4gICAgfVxufSkoKVxuXG5cbmZ1bmN0aW9uIGRvY2xvYWRlZCgpIHtcblxuICAgIGNvbnNvbGUubG9nKCdwYXJzZSBsaW5rcyAuLi4nKTtcbiAgICB2YXIgbGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiYVwiKTtcblxuICAgIGlmIChsaW5rcyAhPSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBmb3VuZCAke2xpbmtzLmxlbmd0aH0gb24gdGhpcyBwYWdlYCk7XG5cbiAgICAgICAgZm9yICh2YXIgaXQgb2YgbGlua3MpIHtcbiAgICAgICAgICAgIHZhciBocmVmQXR0ciA9IGl0LmhyZWY7XG5cbiAgICAgICAgICAgIGlmIChocmVmQXR0ci5zdGFydHNXaXRoKFwiaHR0cHM6Ly9zb2xzY2FuLmlvL2FjY291bnRcIikpIHtcblxuICAgICAgICAgICAgICAgIGxldCBzcGxpdFBhcnRzID0gaHJlZkF0dHIuc3BsaXQoXCJcXC9cIilcbiAgICAgICAgICAgICAgICBsZXQgYWRkciA9IHNwbGl0UGFydHNbc3BsaXRQYXJ0cy5sZW5ndGggLSAxXVxuXG4gICAgICAgICAgICAgICAgaWYgKGl0LnF1ZXJ5U2VsZWN0b3IoXCIuc21ldGFuYUV4cGxvcmVyXCIpID09IG51bGwpIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiBpdHMgYWRkcmVzcyBcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGFkZHIubGVuZ3RoID09IDQ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAtLSAke2hyZWZBdHRyfSAtPiAke2FkZHJ9YClcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWRnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgICAgICAgICBiYWRnZS5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZCBibGFja1wiXG4gICAgICAgICAgICAgICAgICAgIGJhZGdlLnN0eWxlLnBhZGRpbmcgPSBcIjRweFwiXG4gICAgICAgICAgICAgICAgICAgIGJhZGdlLnN0eWxlLm1hcmdpblJpZ2h0ID0gXCIxMHB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGJhZGdlLnN0eWxlLmJvcmRlclJhZGl1cyA9IFwiNHB4XCI7XG4gICAgICAgICAgICAgICAgICAgIGJhZGdlLnN0eWxlLmNvbG9yID0gJ3doaXRlJztcbiAgICAgICAgICAgICAgICAgICAgYmFkZ2Uuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjMTg5QUI0XCI7XG4gICAgICAgICAgICAgICAgICAgIGJhZGdlLm9uY2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic21ldGFuYVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWRkcmVzc1wiOiBhZGRyLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdtc2cgc2VudCA/JylcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgYmFkZ2UuY2xhc3NMaXN0LmFkZChcInNtZXRhbmFFeHBsb3JlclwiKTtcbiAgICAgICAgICAgICAgICAgICAgYmFkZ2UuaW5uZXJUZXh0ID0gXCJAXCIgKyBhZGRyLnN1YnN0cmluZygwLCA0KTtcblxuICAgICAgICAgICAgICAgICAgICBpdC5wcmVwZW5kKGJhZGdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coJ25vIGxpbmtzIGZvdW5kJylcbiAgICB9XG59XG5cbmxldCBsYXN0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBjb25zdCBib2R5T2JqID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuICAgIG9ic2VydmVET00oYm9keU9iaiwgZnVuY3Rpb24gKG0pIHtcbiAgICAgICAgbGFzdFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGRpZmYgbW9yZSB0aGFuIDEgc2VjeFxuICAgICAgICAgICAgY29uc3QgbGFzdEZpcmVkID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBsYXN0VGltZTtcbiAgICAgICAgICAgIGlmIChsYXN0RmlyZWQgPiAyMDApIHtcbiAgICAgICAgICAgICAgICBkb2Nsb2FkZWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgMjUwKVxuXG4gICAgfSk7XG59KTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=