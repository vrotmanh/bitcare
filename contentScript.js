healthy = ["B008U5OSTQ", "B000QJGLHG"]

window.setTimeout(function() {
    document.querySelectorAll("div[class^='asin_card__root__']").forEach(el => {
        if (-1 !== healthy.indexOf(el.children[0].href.split("/")[4].split("?")[0])) {
            const img = document.createElement('img')
            img.src = chrome.extension.getURL("/assets/healthy-seal.png");
            img.style.cssText = "position: absolute; left: 0; top: 0; margin: 0.5rem; width: 5rem; height: auto;";
            el.append(img);
        }
    })
}, 100);