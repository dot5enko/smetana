import { IframeHTMLAttributes } from "react";

export function createPopupObject() {

    let content = '<iframe class="smetana-popup-iframe"></iframe><div class="smetana-splash"></div><div class="smetana-popup" > <div class="smetana-popup-content" >' +
        '<div class="popup-button inactive addressValue"></div>' +
        '<div class="popup-button getFresh" data-id="">GET</div>' +
        '<div class="popup-button">+fav</div>' +
        '<div class="popup-button">config</div>' +
        '</div><div class="popup-data"></div></div>';

    document.body.insertAdjacentHTML('beforeend', content)
}

export function createIframe(url: string) {

    const exists = document.querySelector('.smetana-popup-iframe') as HTMLIFrameElement

    if (!exists) {

        const content = document.createElement("iframe");
        content.className = 'smetana-popup-iframe'
        content.src = url

        const loadComplete = new Promise(resolve => content.addEventListener("load", resolve));

        loadComplete.then((resp) => {
            console.log('parent iframe loaded. run amimation')
        })
    } else {
        exists.src = url;
    }
}