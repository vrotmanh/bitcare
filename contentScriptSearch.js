TYPE_HIDE = 0
TYPE_RECOMMEND = 1
TYPE_NOTHING = 2

// Get healthy option
chrome.storage.local.get(['healthyOptions'], function(result) {
    healthy = result.healthyOptions
})

chrome.storage.local.get(['type'], function(result) {
    console.log("User type: " + result.type)
    window.setTimeout(function() {
        switch(result.type) {
            case TYPE_HIDE:
                document.querySelectorAll("div[class^='asin_card__root__']").forEach(el => {
                    if (-1 === healthy.indexOf(el.children[0].href.split("/")[4].split("?")[0])) {
                        el.parentElement.style.display = "none"
                    }
                })
                break;
            case TYPE_RECOMMEND:
                document.querySelectorAll("div[class^='asin_card__root__']").forEach(el => {
                    if (-1 !== healthy.indexOf(el.children[0].href.split("/")[4].split("?")[0])) {
                        const img = document.createElement('img')
                        img.src = chrome.extension.getURL("/assets/healthy-seal.png");
                        img.style.cssText = "position: absolute; left: 0; top: 0; margin: 0.5rem; width: 5rem; height: auto;";
                        el.append(img);
                    }
                })
                break;
            case TYPE_NOTHING:
              // nothing
          }
    }, 100);
});