export function createPopupObject() {

    let content = '<div class="smetana-popup" > <div class="smetana-popup-content" >' +
        '<div class="popup-button inactive addressValue"></div>' +
        '<div class="popup-button getFresh" data-id="">GET</div>' +
        '<div class="popup-button">+fav</div>' +
        '<div class="popup-button">config</div>' +
        '</div><div class="popup-data"></div></div>';

    document.body.insertAdjacentHTML('beforeend', content)
}